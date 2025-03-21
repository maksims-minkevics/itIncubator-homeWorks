import mongoose, { Schema, Document } from 'mongoose';
import {ObjectId} from "mongodb";

export interface ICommentatorInfo {
    userId: string,
    userLogin: string;
}

export interface ICommentsLikeInfo {
    status: string,
    commentId: string,
    userId: string
}

export interface IComments extends Document {
    _id: ObjectId,
    content: string,
    commentatorInfo: ICommentatorInfo,
    createdAt: string,
    postId: string,
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

export const CommentsLikeSchema= new Schema<ICommentsLikeInfo>({
    userId: { type: String, required: true },
    commentId: { type: String, required: true },
    status: { type: String, default: "None"}
});