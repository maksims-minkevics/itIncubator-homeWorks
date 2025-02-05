import { sessionCollection } from "../../app/db";
import { SessionDbModel, SessionViewModel } from "./dataModels";
import {ObjectId} from "mongodb";

class Repositories {
    private static instance: Repositories;

    private constructor() {}

    static getInstance(): Repositories {
        if (!Repositories.instance) {
            Repositories.instance = new Repositories();
        }
        return Repositories.instance;
    }

    private excludeId = { projection: { _id: 0 } };

    async create(metaData: SessionDbModel): Promise<void> {
        try {
            await sessionCollection.insertOne(metaData);
        } catch (error) {
            console.error("Error creating session:", error);
            throw new Error("Database error while creating session");
        }
    }

    /** 📌 Получить все активные сессии пользователя */
    async findActiveSessions(userId: ObjectId): Promise<SessionViewModel[]> {
        return await sessionCollection
            .aggregate([
                { $match: { userId } },
                {
                    $addFields: {
                        expireDate: { $dateFromString: { dateString: "$expireAt" } }
                    }
                },
                { $match: { expireDate: { $gte: new Date() } } },
                {
                    $project: {
                        title: "$deviceName",
                        ip: 1,
                        lastActiveDate: 1,
                        deviceId: 1,
                        _id: 0
                    }
                }
            ])
            .toArray() as SessionViewModel[];

    }

    async getActiveSession(deviceId: string): Promise<SessionDbModel | null> {
        return sessionCollection.findOne({ deviceId }, this.excludeId);
    }

    async findOne(query: Partial<SessionDbModel>): Promise<SessionDbModel | null> {
        if (Object.keys(query).length === 0) return null;
        return sessionCollection.findOne(query, this.excludeId);
    }

    async updateSession(deviceId: string, updateData: Partial<SessionDbModel>): Promise<boolean> {
        const result = await sessionCollection.updateOne(
            { deviceId },
            { $set: updateData }
        );
        return result.modifiedCount > 0;
    }

    async delete(deviceId: string, userId: ObjectId): Promise<boolean> {
        const result = await sessionCollection.deleteOne({ deviceId, userId });
        return result.deletedCount === 1;
    }

    async updateMany(deviceId: string, userId: ObjectId, updateData: Partial<SessionDbModel>): Promise<boolean> {
        const result = await sessionCollection.updateMany(
            { userId, deviceId: { $ne: deviceId } },
            { $set: updateData }
        );
        return result.modifiedCount > 0;
    }

    async deleteAllExceptCurrent(deviceId: string, userId: ObjectId): Promise<boolean> {
        const result = await sessionCollection.deleteMany({
            userId,
            deviceId: { $ne: deviceId },
        });
        return result.deletedCount > 0;
    }

    async dropDb(): Promise<void> {
        await sessionCollection.drop();
    }
}

export const sessionRepository = Repositories.getInstance();
