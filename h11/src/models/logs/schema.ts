import {Document, Schema} from "mongoose";
import {ObjectId} from "mongodb";

export interface ILogs extends Document {
    _id: ObjectId,
    date: Date,
    ip: string,
    url: string;
}

export const LogsSchema = new Schema<ILogs>(
    {
        ip: { type: String, required: true},
        url: { type: String, required: true},
        date: { type: Date, default: new Date()},
    },
    { versionKey: false , _id: true}
);