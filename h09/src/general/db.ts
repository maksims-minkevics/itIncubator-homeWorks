import dotenv from "dotenv";
import {MongoClient} from 'mongodb'
import {
    ActivityAuditDbModel,
} from "./index";
import {consts} from "./global-consts";
import {SessionDbModel} from "../models/session/dataModels";
import {UserDbModel} from "../models/user/dataModels";
import {BlogDbModel} from "../models/blog/dataModels";
import {PostDbModel} from "../models/post/dataModels";
import {CommentDbModel} from "../models/comment/dataModels";

dotenv.config()
const mongoURI: string = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbClient = new MongoClient(mongoURI);
const blogerPlatform = dbClient.db(consts.DB_NAME);
export const postsCollection = blogerPlatform.collection<PostDbModel>(consts.POSTS_COLLECTION);
export const blogCollection = blogerPlatform.collection<BlogDbModel>(consts.BLOGS_COLLECTION);
export const userCollection = blogerPlatform.collection<UserDbModel>(consts.USER_COLLECTION);
export const commentCollection = blogerPlatform.collection<CommentDbModel>(consts.COMMENTS_COLLECTION);
export const sessionCollection = blogerPlatform.collection<SessionDbModel>(consts.SESSIONS_COLLECTION);
export const activityAuditCollection = blogerPlatform.collection<ActivityAuditDbModel >(consts.ACTIVITY_AUDIT_COLLECTION);


export async function dbRun(){
    try {
        await dbClient.connect();
        await dbClient.db(consts.DB_NAME).command({ ping: 1 });
        console.log("Connected to DB");
    }
    catch (e) {
        console.log(e);
        await dbClient.close();
    }
}