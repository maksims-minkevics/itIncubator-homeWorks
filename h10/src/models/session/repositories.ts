import { sessionCollection } from "../../general/db";
import {SessionDbModel, SessionInsertDbModel} from "./dataModels";
import {DeleteResult, InsertOneResult, UpdateResult} from "mongodb";

export class SessionRepository{

      async create(metaData: SessionInsertDbModel): Promise<InsertOneResult<SessionDbModel> | null> {
        try {
            return (await sessionCollection.insertOne(metaData as any));
        } catch (error) {
            console.error("Error creating session:", error);
            return null
        }
    }

    async findActiveSessions(userId: string): Promise<SessionDbModel[]> {
        const result = await sessionCollection
            .aggregate([
                { $match: { userId } },
                {
                    $addFields: {
                        expireDate: { $dateFromString: { dateString: "$expireAt" } }
                    }
                },
                { $match: { expireDate: { $gte: new Date() } } }
            ])
            .toArray();

        return result as SessionDbModel[];
    }

    async getActiveSession(deviceId: string): Promise<SessionDbModel | null> {
        return sessionCollection.findOne({ deviceId:deviceId });
    }

    async findOne(query: Partial<SessionDbModel>): Promise<SessionDbModel | null> {
        if (Object.keys(query).length === 0) return null;
        return sessionCollection.findOne(query);
    }

    async updateSession(deviceId: string, updateData: Partial<SessionDbModel>): Promise<UpdateResult<SessionDbModel>> {
        return await sessionCollection.updateOne(
            { deviceId:deviceId },
            { $set: updateData }
        );
    }

    async delete(deviceId: string, userId: string): Promise<DeleteResult> {
        return await sessionCollection.deleteOne({ deviceId:deviceId, userId:userId });
    }

    async updateMany(deviceId: string, userId: string, updateData: Partial<SessionDbModel>): Promise<UpdateResult<SessionDbModel>> {
        return await sessionCollection.updateMany(
            { deviceId:deviceId, userId:userId },
            { $set: updateData }
        );
    }

    async deleteAllExceptCurrent(deviceId: string, userId: string): Promise<DeleteResult> {
        return await sessionCollection.deleteMany(
            { deviceId: { $ne: deviceId }, userId:userId }
        );
    }

    async dropDb(): Promise<void> {
        await sessionCollection.drop();
    }
}