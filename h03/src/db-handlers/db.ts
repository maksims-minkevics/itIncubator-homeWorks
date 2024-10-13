import dotenv from "dotenv";
import {MongoClient, ServerApiVersion} from 'mongodb'
import {BlogViewModel, PostViewModel} from "../object-types";

dotenv.config()

const mongoURI: string = "mongodb://localhost:27017"
const dbClient = new MongoClient(mongoURI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const blogerPlatform = dbClient.db("BlogerPlatform");
export const postsCollection = blogerPlatform.collection<PostViewModel>("Posts");
export const blogCollection = blogerPlatform.collection<BlogViewModel>("Blogs")
export async function dbRun(){
    try {
        await dbClient.connect();
        await dbClient.db("admin").command({ ping: 1 });
        console.log("connected to DB");
    }
    catch (e) {
        console.log(e)
        await dbClient.close();
    }
}