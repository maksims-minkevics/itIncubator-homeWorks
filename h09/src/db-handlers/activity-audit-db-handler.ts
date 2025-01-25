import {ActivityAuditDbModel} from "../app/index";
import {activityAuditCollection, refreshTokenMetaDataCollection} from "../app/db";


class activityAuditDbHandler {

    async create(url: string, date: Date, ip: string):Promise<string|undefined>{
        return (await  activityAuditCollection.insertOne({
            date: date,
            ip: ip,
            url: url
        })).insertedId.toString();
    };

    async get(
        ip: string,
        { url = "", date = undefined} = {}
    ): Promise<ActivityAuditDbModel[] | undefined> {
        const getFields: Record<string, any> = {};

        if (url) getFields.url = url;
        if (date) getFields.date = date;
        getFields.ip = ip;
        const results = await activityAuditCollection
            .find(
                getFields,
                { projection: { _id: 0 } }
            )
            .toArray();

        return results.length > 0 ? results : undefined;
    };

    async getByDate(
        ip: string,
        date: Date
    ): Promise<ActivityAuditDbModel[] | []> {
        const getFields: Record<string, any> = {};


        const results = await activityAuditCollection
            .find(
                {
                    ip: ip, date: {$gte: date}
                },
                { projection: { _id: 0 } }
            )
            .toArray();

        return results;
    };

    async update(
        ip: string,
        { url = "", date = ""}: { url?: string; date?: string}
        ): Promise<boolean> {
        const updateFields: Record<string, any> = {};

        if (url) updateFields.url = url;
        if (date) updateFields.date = date;

        return (await activityAuditCollection
            .updateOne(
                {ip: ip},
                {$set : updateFields}
            )).modifiedCount !== 0;
    };

    async dropDb(){
        await activityAuditCollection.drop();
    }

}
export {activityAuditDbHandler}