import {ActivityAuditDbModel} from "../app/index";
import {activityAuditCollection, refreshTokenMetaDataCollection} from "../app/db";


class activityAuditDbHandler {

    async create(url: string, date: Date, ip: string, deviceId: string, userId: string):Promise<string|undefined>{
        return (await  activityAuditCollection.insertOne({
            userId: userId,
            deviceId: deviceId,
            date: date,
            ip: ip,
            url: url
        })).insertedId.toString();
    };

    async get(
        deviceId: string,
        userId: string,
        { url = "", date = undefined, ip = "" } = {}
    ): Promise<ActivityAuditDbModel[] | undefined> {
        const getFields: Record<string, any> = {};

        if (url) getFields.url = url;
        if (date) getFields.date = date;
        if (ip) getFields.ip = ip;
        getFields.deviceId = deviceId;
        getFields.userId = userId;

        if (Object.keys(getFields).length === 0) {
            return undefined;
        }

        const results = await activityAuditCollection
            .find(
                getFields,
                { projection: { _id: 0 } }
            )
            .toArray();

        return results.length > 0 ? results : undefined;
    };

    async getByDate(
        deviceId: string,
        userId: string,
        date: Date
    ): Promise<ActivityAuditDbModel[] | []> {
        const getFields: Record<string, any> = {};


        const results = await activityAuditCollection
            .find(
                {
                    deviceId: deviceId, userId: userId, date: {$gte: date}
                },
                { projection: { _id: 0 } }
            )
            .toArray();

        return results;
    };

    async update(
        deviceId: string,
        userId: string,
        { url = "", date = "", ip = "" }: { url?: string; date?: string; ip?: string }
        ): Promise<boolean> {
        const updateFields: Record<string, any> = {};

        if (url) updateFields.url = url;
        if (date) updateFields.date = date;
        if (ip) updateFields.ip = ip;

        return (await activityAuditCollection
            .updateOne(
                {deviceId: deviceId, userId: userId},
                {$set : updateFields}
            )).modifiedCount !== 0;
    };

    async delete(){

    }

}
export {activityAuditDbHandler}