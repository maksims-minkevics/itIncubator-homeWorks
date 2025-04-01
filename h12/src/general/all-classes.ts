import mongoose, {Model} from "mongoose";
import { UsersSchema} from "../models/user/schemas";
import {PostsLikeSchema, PostsSchema} from "../models/post/schemas";
import {SessionsSchema} from "../models/session/schemas";
import {CommentsLikeSchema, CommentsSchema} from "../models/comment/schemas";
import {BlogsSchema} from "../models/blog/schemas";
import {LogsSchema} from "../models/logs/schema";


export const UsersModel= mongoose.model("Users", UsersSchema);

export const PostsModel= mongoose.model("Posts", PostsSchema);

export const SessionsModel= mongoose.model("Session", SessionsSchema);

export const CommentsModel= mongoose.model("Comments", CommentsSchema);

export const BlogsModel= mongoose.model("Blogs", BlogsSchema);
export const LogsModel= mongoose.model("Logs", LogsSchema);

export const CommentsLikesModel= mongoose.model("CommentsLikes", CommentsLikeSchema);
export const PostsLikesModel= mongoose.model("PostsLikes", PostsLikeSchema);

