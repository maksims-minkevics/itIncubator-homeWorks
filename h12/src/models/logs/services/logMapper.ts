import {ILogs} from "../schema";
import {LogsDbModel} from "../dataModels";

export const getLogDbModel = async (log: ILogs | null): Promise<LogsDbModel | null> => {
    if (!log) return null;

    return {
        _id: log._id,
        url: log.url,
        ip: log.ip,
        date: log.date
    };
}