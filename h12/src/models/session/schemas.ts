import { Schema, Document } from "mongoose";
import {ObjectId} from "mongodb";

export interface ISession extends Document {
    _id: ObjectId
    ip: string,
    lastActiveDate: string,
    deviceId: string,
    deviceName: string
    expireAt: Date,
    issuedAt: string,
    userId: string
}

export const SessionsSchema = new Schema<ISession>(
    {
        ip: { type: String, default: "" },
        lastActiveDate: { type: String, default: "" },
        deviceId: { type: String, default: "" },
        deviceName: { type: String, default: "" },
        expireAt: { type: Date},
        issuedAt: { type: String, default: () => new Date().toISOString() },
        userId: { type: String, default: "" },
    },
    { versionKey: false , _id: true}
);