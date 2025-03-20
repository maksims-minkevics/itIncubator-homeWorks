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
import mongoose from "mongoose";

dotenv.config()
const mongoURI: string = process.env.MONGOOSE_URL || "mongodb://localhost:27017";
const mongooseURI: string = process.env.MONGOOSE_URL || "mongodb://localhost:27017";
const dbClient = new MongoClient(mongoURI);
const blogerPlatform = dbClient.db(consts.DB_NAME);
export const activityAuditCollection = blogerPlatform.collection<ActivityAuditDbModel >(consts.ACTIVITY_AUDIT_COLLECTION);


export async function dbRun(){
    try {
        await dbClient.connect();
        await dbClient.db(consts.DB_NAME).command({ ping: 1 });
        console.log("✅  MongoDB connected successfully!");
    }
    catch (e) {
        console.error("❌  Error in dbRunMongoose:", e);
        await dbClient.close();
    }
}

export async function dbRunMongoose(){
    try {
        mongoose.set('bufferCommands', false)
        await mongoose.connect(mongooseURI, {dbName: "BloggerPlatform"});

        if (mongoose.connection.readyState==1){
            console.log("✅  MongoDB connected successfully! || dbRunMongoose");
        }
        else {
            await mongoose.disconnect();
            console.error("❌  Error in dbRunMongoose:");
        }
    }
    catch (e) {
        console.error(e);
    }
};
