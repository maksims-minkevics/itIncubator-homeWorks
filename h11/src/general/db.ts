import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()
const mongooseURI: string = process.env.MONGOOSE_URL || "mongodb://localhost:27017";

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
