import mongoose, {Document, Schema,} from "mongoose";
import {PostDbModel} from "./dataModels";
import {ObjectId} from "mongodb";

export interface IPostsLikeInfo {
        status: string,
        postId: ObjectId,
        userId: string,
        login: string,
        addedAt: string
}
export interface IPosts extends Document {
        _id: ObjectId,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
        createdAt: string
};
export const PostsSchema = new Schema<IPosts>(
    {
        title: { type: String, required: true, minlength: 1, maxlength: 30},
        shortDescription: { type: String, required: true, minlength: 1, maxlength: 100},
        content: { type: String, required: true, minlength: 1, maxlength: 1000 },
        blogId: { type: String, required: true, },
        blogName: { type: String, required: true },
        createdAt: { type: String, default: () => new Date().toISOString() },
    },
    { versionKey: false , _id: true}
);

export const PostsLikeSchema= new Schema<IPostsLikeInfo>({
    userId: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts", required: true },
    status: { type: String, default: "None"},
    login: { type: String, required: true },
    addedAt: { type: String, required: true }
    },
    { versionKey: false , _id: true}
);