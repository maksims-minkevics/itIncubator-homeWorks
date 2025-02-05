import {ObjectId} from "mongodb";

export type SessionDbModel = {
    ip: string,
    lastActiveDate: string,
    deviceId: string,
    deviceName?: string
    expireAt: string,
    issuedAt: string,
    userId: ObjectId
}

export type SessionViewModel = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}