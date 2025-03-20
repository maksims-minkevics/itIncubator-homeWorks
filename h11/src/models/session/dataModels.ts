import {ObjectId} from "mongodb";

export type SessionDbModel = {
    _id: ObjectId
    ip: string,
    lastActiveDate: string,
    deviceId: string,
    deviceName: string
    expireAt: string,
    issuedAt: string,
    userId: string
}
export type SessionInsertDbModel = {
    ip: string,
    lastActiveDate: string,
    deviceId: string,
    deviceName?: string
    expireAt: string,
    issuedAt: string,
    userId: string
}

export type SessionViewModel = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}