import { Schema, Document } from "mongoose";
import {ObjectId} from "mongodb";

export interface IUsers extends Document {
    _id: ObjectId;
    login: string;
    email: string;
    password: string;
    createdAt: string;
    confirmationCode: string;
    isActivated: boolean;
    pswrdRecoveryCode: string;
}

export const UsersSchema = new Schema<IUsers>(
    {
        login: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        confirmationCode: { type: String, default: "" },
        isActivated: { type: Boolean, default: false },
        pswrdRecoveryCode: { type: String, default: "" },
        createdAt: { type: String, default: () => new Date().toISOString() },
    },
{ versionKey: false , _id: true}
);