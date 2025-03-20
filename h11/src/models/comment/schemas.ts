import mongoose, { Schema, Document } from 'mongoose';
import {ObjectId} from "mongodb";

// Определение интерфейса для TypeScript
export interface CommentatorInfo {
    userId: string;
    userLogin: string;
}

export interface IComments extends Document {
    _id: ObjectId
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    postId: string;
}

export const CommentsSchema = new Schema<IComments>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, default: () => new Date().toISOString() },
    postId: { type: String, required: true },
});