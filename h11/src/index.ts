import {app} from "./app";
import dotenv from "dotenv";
import {dbRunMongoose} from "./general/db";
dotenv.config();
const startApp = async () => {
    console.log("app starting...")
    await dbRunMongoose();

    app.listen(process.env.PORT, () => {
        console.log("started on -- " + process.env.PORT)
    });

}
startApp();