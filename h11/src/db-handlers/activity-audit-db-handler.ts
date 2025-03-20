import {ActivityAuditDbModel} from "../general/index";
import {activityAuditCollection} from "../general/db";


class activityAuditDbHandler {
    async create(url: string, date: Date, ip: string):Promise<string|undefined>{
        return (await  activityAuditCollection.insertOne({
            date: date,
            ip: ip,
            url: url
        })).insertedId.toString();
    };

    async getByDate(
        ip: string,
        date: Date,
        url: string
    ): Promise<ActivityAuditDbModel[] | []> {
        const getFields: Record<string, any> = {};


        const results = await activityAuditCollection
            .find(
                {
                    ip: ip, date: {$gte: date}, url: url
                },
                { projection: { _id: 0 } }
            )
            .toArray();

        return results;
    };


    async dropDb(){
        await activityAuditCollection.drop();
    }

}
export {activityAuditDbHandler}