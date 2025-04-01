import {app} from "./app";
import dotenv from "dotenv";
import {dbRunMongoose} from "./general/db";
import {test123} from "./general/test-mongoose";
dotenv.config();
const startApp = async () => {
    console.log("app starting...")
    await dbRunMongoose();
    //await test123();

    app.listen(process.env.PORT, () => {
        console.log("started on -- " + process.env.PORT)
    });

}
startApp();