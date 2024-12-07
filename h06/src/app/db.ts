import dotenv from "dotenv";
import {MongoClient} from 'mongodb'
import {BlogViewModel, CommentDbModel, PostViewModel, UserDbModel} from "./index";
import {consts} from "./global-consts";

dotenv.config()
const mongoURI: string = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbClient = new MongoClient(mongoURI);
const blogerPlatform = dbClient.db(consts.DB_NAME);
export const postsCollection = blogerPlatform.collection<PostViewModel>(consts.POSTS_COLLECTION);
export const blogCollection = blogerPlatform.collection<BlogViewModel>(consts.BLOGS_COLLECTION);
export const userCollection = blogerPlatform.collection<UserDbModel>(consts.USER_COLLECTION);
export const commentCollection = blogerPlatform.collection<CommentDbModel>(consts.COMMENTS_COLLECTION);

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