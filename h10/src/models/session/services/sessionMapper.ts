import {SessionDbModel, SessionViewModel} from "../dataModels";
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