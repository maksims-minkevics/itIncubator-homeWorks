import {SessionDbModel, SessionInsertDbModel} from "./dataModels";
import {DeleteResult, InsertOneResult, UpdateResult} from "mongodb";
import {SessionsModel} from "../../general/all-classes";
import {getArrayOfSessionDbModels, getSessionDbModel} from "./services/sessionMapper";

export class SessionRepository{
      async create(data: SessionInsertDbModel): Promise<SessionDbModel | null> {
        try {
            const newSession = new SessionsModel({
                    ip: data.ip,
                    lastActiveDate: data.lastActiveDate,
                    deviceId: data.deviceId,
                    deviceName : data.deviceName,
                    expireAt: new Date(data.expireAt),
                    issuedAt: data.issuedAt,
                    userId: data.userId
            });
            await newSession.save();
            return await getSessionDbModel(newSession);
        } catch (error) {
            console.error("Error creating session:", error);
            return null
        }
    }

    async findActiveSessions(userId: string): Promise<SessionDbModel[] | []> {
        const result = await SessionsModel.find({
            userId: userId,
            expireAt: { $gte: new Date() }
        });
        return await getArrayOfSessionDbModels(result);
    }

    async getActiveSession(deviceId: string): Promise<SessionDbModel | null> {
        return await getSessionDbModel(await SessionsModel.findOne({ deviceId:deviceId }).lean());
    }

    async findOne(query: Partial<SessionDbModel>): Promise<SessionDbModel | null> {
        if (Object.keys(query).length === 0) return null;
        const result =  await SessionsModel.findOne(query);
        return await getSessionDbModel(result);
    }

    async updateSession(deviceId: string, updateData: Partial<SessionDbModel>): Promise<UpdateResult<SessionDbModel>> {
        return SessionsModel.updateOne(
            { deviceId:deviceId },
            { $set: updateData }
        ).lean();
    }

    async delete(deviceId: string, userId: string): Promise<DeleteResult> {
        return SessionsModel.deleteOne({ deviceId:deviceId, userId:userId }).lean();
    }

    async updateMany(deviceId: string, userId: string, updateData: Partial<SessionDbModel>): Promise<UpdateResult<SessionDbModel>> {
        return SessionsModel.updateMany(
            { deviceId:deviceId, userId:userId },
            { $set: updateData }
        ).lean();
    }

    async deleteAllExceptCurrent(deviceId: string, userId: string): Promise<DeleteResult> {
        return SessionsModel.deleteMany(
            { deviceId: { $ne: deviceId }, userId:userId }
        );
    }

    async dropDb(): Promise<void> {
        await SessionsModel.collection.drop();
    }
}