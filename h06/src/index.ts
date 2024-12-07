import {app} from "./app";
import dotenv from "dotenv";
import {dbRun} from "./app/db";
dotenv.config();
import { injectSpeedInsights } from '@vercel/speed-insights';
const startApp = async () => {
    injectSpeedInsights();
    console.log("app started...")
    await dbRun();
    app.listen(process.env.PORT, () => {
        console.log("started on -- " + process.env.PORT)
    });
}
startApp();