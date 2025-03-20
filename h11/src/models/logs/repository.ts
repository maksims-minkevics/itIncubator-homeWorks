import {LogsDbModel} from "./dataModels";
import {LogsModel} from "../../general/all-classes";
import {getLogDbModel} from "./services/logMapper";

export class LogRepository {
    async create(ip: string, url: string):Promise<LogsDbModel | null>{
        try {
            const newEntry = new LogsModel({
                ip: ip,
                url: url
            });
            await newEntry.save();
            return await getLogDbModel(newEntry);
        } catch (error) {
            console.error("❌ Error in create:", error);
            return null
        }
    }

    async getRequestNumberByDate(url: string, ip: string, date: Date):Promise<Number>{
        try {
            return await LogsModel.countDocuments({ip: ip, date: {$gte: date}, url: url}).exec()

        } catch (error) {
            console.error("❌ Error in getByDate:", error);
            return NaN
        }
    }

    async dropDb(){
        try {
            await LogsModel.collection.drop();

        } catch (error) {
            console.error("❌ Error in dropDb:", error);
        }
    }
}