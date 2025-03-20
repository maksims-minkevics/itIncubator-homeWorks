import {SessionRepository} from "../repositories";
import {ServiceResult} from "../../../general";
import {SessionDbModel, SessionViewModel} from "../dataModels";
import {SERVICE_CUSTOM_MSG} from "../../../general/global-consts";
import {getArrayOfSessionViewModels} from "./sessionMapper";

export class SessionService {
    constructor(protected sessionRepository: SessionRepository) {
    }

    async getActiveSessions(userId: string): Promise<ServiceResult<SessionViewModel[]>> {
        try {
            const activeSessions = await this.sessionRepository.findActiveSessions(userId);
            if (!activeSessions){
                return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
            }
            const arrayOfActiveSessionViewModels = await getArrayOfSessionViewModels(activeSessions);

            return {data: arrayOfActiveSessionViewModels, status: true}
        } catch (error) {
            console.error("Error in getActiveSessions:", error);
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.DB_ERROR};
        }
    }

    async deleteAllExceptCurrent(deviceId: string, userId: string): Promise<ServiceResult<SessionDbModel>> {
        try {
            const isDeleted = await this.sessionRepository.deleteAllExceptCurrent(deviceId, userId);
            if(isDeleted.deletedCount === 0){
                return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
            }

            return {data: null, status: true}
        } catch (error) {
            console.error("Error in deleteAllExceptCurrent:", error);
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.DB_ERROR};
        }
    }

    async deleteById(deviceId: string, userId: string): Promise<ServiceResult<SessionDbModel>> {
        try {
            const isDeleted = await this.sessionRepository.delete(deviceId, userId);
            if (!isDeleted){
                return {data: null, status: false}
            }
            if(isDeleted.deletedCount === 0){
                return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
            }

            return {data: null, status: true}
        } catch (error) {
            console.error("Error in deleteById:", error);
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.DB_ERROR};
        }
    }

    async create(
        userAgent: string,
        userIp: string,
        deviceId: string,
        userId: string,
        expireAt: string,
        issuedAt: string
    ): Promise<ServiceResult<SessionDbModel>>{
        const insertData = {
                deviceId: deviceId,
                userId: userId,
                deviceName: userAgent,
                ip: userIp,
                lastActiveDate: issuedAt,
                issuedAt: issuedAt,
                expireAt: expireAt
        };
        const newEntry = await this.sessionRepository.create(insertData);
        if (!newEntry){
            return {data: null, status: false}
        }
        return {data: newEntry, status: true}
    }

    async updateSession(
        deviceId: string,
        expireAt: string,
        issuedAt: string
    ): Promise<ServiceResult<SessionDbModel>>{
        const isUpdated = await this.sessionRepository.updateSession(
            deviceId,
            {
                issuedAt: issuedAt,
                expireAt: expireAt,
                lastActiveDate: issuedAt
            }
        );
        if (isUpdated.matchedCount === 0){
            return {data:null, status: false}
        }
        return {data: null, status: true}
    }

    async findOne(sessionData: Partial<SessionDbModel>): Promise<ServiceResult<SessionDbModel>>{
        const session = await this.sessionRepository.findOne(sessionData);
        if(!session){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }

        return {data: session, status: true}
    }

}
