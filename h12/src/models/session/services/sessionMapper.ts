import {SessionDbModel, SessionViewModel} from "../dataModels";
import {ISession} from "../schemas";
import {ObjectId} from "mongodb";
export const getSessionViewModel = async (session: SessionDbModel): Promise<SessionViewModel | undefined> => {
    if (session){
        return {
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.lastActiveDate,
            deviceId: session.deviceId,
        };
    }
    return undefined
}


export const getArrayOfSessionViewModels = async (sessions: SessionDbModel[] | []): Promise<SessionViewModel[] | []> => {
    if (Array.isArray(sessions)){
        return sessions.map(session => ({
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.lastActiveDate,
            deviceId: session.deviceId,
        }));
    }
    return []
}


export const getArrayOfSessionDbModels = async (sessions: ISession[] | []): Promise<SessionDbModel[] | []> => {
    if (Array.isArray(sessions)){
        return sessions.map(session => ({
            _id: session._id,
            ip: session.ip,
            lastActiveDate: session.lastActiveDate,
            deviceId: session.deviceId,
            deviceName: session.deviceName,
            expireAt: session.expireAt.toISOString(),
            issuedAt: session.issuedAt,
            userId: session.userId,
        }));
    }
    return []
}

export const getSessionDbModel = async (session: ISession | null): Promise<SessionDbModel | null> => {
    if (!session){
        return null;

    }

    return {
        _id: session._id,
        ip: session.ip,
        lastActiveDate: session.lastActiveDate,
        deviceId: session.deviceId,
        deviceName: session.deviceName,
        expireAt: session.expireAt.toISOString(),
        issuedAt: session.issuedAt,
        userId: session.userId,
    };
}