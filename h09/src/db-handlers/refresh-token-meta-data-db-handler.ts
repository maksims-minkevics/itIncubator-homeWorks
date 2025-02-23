import {refreshTokenMetaDataCollection} from "../app/db";
import {RefreshTokenMetaDataDbModel, SessionViewModel} from "../app/index";
import {mongoDbDate} from "../app/utilities";


class RefreshTokenMetaDataDbHandler{

    async create(metaData: RefreshTokenMetaDataDbModel){
        await refreshTokenMetaDataCollection.insertOne(metaData);
    };

    async getAllActiveSessions(userId: string): Promise<SessionViewModel[]> {
        const sessions = await refreshTokenMetaDataCollection
            .aggregate([
                {
                    $match: {
                        userId: userId
                    }
                },
                {
                    $addFields: {
                        expireDate: { $dateFromString: { dateString: "$expireAt" } }
                    }
                },
                {
                    $match: {
                        expireDate: { $gte: new Date() }
                    }
                },
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
            .toArray();
        return sessions as SessionViewModel[];
    }

    async getActiveSession(deviceId: string): Promise<RefreshTokenMetaDataDbModel|null>{
        return (await refreshTokenMetaDataCollection.findOne({deviceId: deviceId}, { projection: { _id: 0} }));
    };

    async getOne({
        deviceId = "",
        userId = "",
        issuedAt = "",
        expireAt = "",
        lastActiveDate = "",
        ip = "",
        deviceName = ""
    }): Promise<RefreshTokenMetaDataDbModel | null> {
        const getFields: Record<string, any> = {};

        if (deviceId) getFields.deviceId = deviceId;
        if (userId) getFields.userId = userId;
        if (issuedAt) getFields.issuedAt = issuedAt;
        if (expireAt) getFields.expireAt = expireAt;
        if (lastActiveDate) getFields.lastActiveDate = lastActiveDate;
        if (ip) getFields.ip = ip;
        if (deviceName) getFields.deviceName = deviceName;

        if (Object.keys(getFields).length === 0) {
            return null;
        }

        return (
            refreshTokenMetaDataCollection.findOne(
                getFields,
                { projection: { _id: 0 } }
            )
        )
    }

    async updateSession(deviceId = "", {issuedAt = "", expireAt = "", lastActiveDate = "" }) {
        const updateFields: Record<string, any> = {};

        if (issuedAt) updateFields.issuedAt = issuedAt;
        if (expireAt) updateFields.expireAt = expireAt;
        if (lastActiveDate) updateFields.lastActiveDate = lastActiveDate;


        const result = await refreshTokenMetaDataCollection.updateOne(
            { deviceId: deviceId },
            { $set: updateFields },
        );
        return result.modifiedCount > 0;
    }

    async delete(deviceId: string, userId: string):Promise<boolean>{
        return( await refreshTokenMetaDataCollection.deleteOne({deviceId:deviceId, userId: userId})).deletedCount === 1
    }

    async updateAllExceptCurrent(
        deviceId: string,
        userId: string,
        {
            issuedAt = "",
            expireAt = "",
            lastActiveDate = ""
        }
    ):Promise<boolean>{
        const updateFields: Record<string, any> = {};

        if (issuedAt) updateFields.issuedAt = issuedAt;
        if (expireAt) updateFields.expireAt = expireAt;
        if (lastActiveDate) updateFields.lastActiveDate = lastActiveDate;
        console.log(updateFields)

        const result = await refreshTokenMetaDataCollection.updateMany(
            {
                userId: userId,
                deviceId: { $ne: deviceId },
            },
            { $set: updateFields }
        );

        return result.modifiedCount > 0
    };

    async deleteAllExceptCurrent(
        deviceId: string,
        userId: string,
    ):Promise<boolean>{
        const result = await refreshTokenMetaDataCollection.deleteMany(
            {
                userId: userId,
                deviceId: { $ne: deviceId },
            },
        );

        return result.deletedCount > 0
    };

    async dropDb(){
        await refreshTokenMetaDataCollection.drop();
    }
}

export {RefreshTokenMetaDataDbHandler};