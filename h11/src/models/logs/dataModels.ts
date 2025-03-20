import {ObjectId} from "mongodb";

export type LogsDbModel = {
    _id: ObjectId
    ip: string,
    url: string,
    date: Date
}