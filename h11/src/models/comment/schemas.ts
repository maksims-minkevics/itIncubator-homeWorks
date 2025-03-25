import mongoose, { Schema, Document } from 'mongoose';
import {ObjectId} from "mongodb";

export interface ICommentatorInfo {
    userId: string,
    userLogin: string;
}

export interface ICommentsLikeInfo {
    status: string,
    commentId: ObjectId,
    userId: string
}

export interface IComments extends Document {
    _id: ObjectId,
    content: string,
    commentatorInfo: ICommentatorInfo,
    createdAt: string,
    postId: ObjectId,
}

export const CommentsSchema = new Schema<IComments>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, default: () => new Date().toISOString() },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts", required: true },
    },
    { versionKey: false , _id: true}
);

export const CommentsLikeSchema= new Schema<ICommentsLikeInfo>({
    userId: { type: String, required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comments", required: true },
    status: { type: String, default: "None"}
    },
    { versionKey: false , _id: true}
);