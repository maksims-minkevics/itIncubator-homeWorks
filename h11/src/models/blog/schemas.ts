import { Schema, Document } from "mongoose";
import {ObjectId} from "mongodb";

export interface IBlogs extends Document {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
};

export const BlogsSchema = new Schema<IBlogs>(
    {
        name: { type: String, default: "", required: true },
        description: { type: String, default: "", required: true  },
        websiteUrl: { type: String, default: "" , required: true },
        isMembership: {type: Boolean, default: false, required: true  },
        createdAt: { type: String, default: () => new Date().toISOString(), required: true  },
    },
    { versionKey: false , _id: true}
);