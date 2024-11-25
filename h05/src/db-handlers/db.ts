import dotenv from "dotenv";
import {MongoClient, ServerApiVersion} from 'mongodb'
import {BlogViewModel, PostViewModel, UserViewModel} from "../object-types";

dotenv.config()
const mongoURI: string = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbClient = new MongoClient(mongoURI);
const blogerPlatform = dbClient.db("BlogerPlatform");
export const postsCollection = blogerPlatform.collection<PostViewModel>("Posts");
export const blogCollection = blogerPlatform.collection<BlogViewModel>("Blogs")
export const userCollection = blogerPlatform.collection<UserViewModel>("Users")
export async function dbRun(){
    try {
        await dbClient.connect();
        await dbClient.db("BlogerPlatform").command({ ping: 1 });
        console.log("connected to DB");
    }
    catch (e) {
        console.log(e)
        await dbClient.close();
    }
}