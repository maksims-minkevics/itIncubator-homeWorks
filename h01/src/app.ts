import express from 'express';
import {SETTINGS} from "./settings";
import {createDb} from "./db";
import {VideoDataValidation} from "./dataValidations/videoDataValidation"
import {testingRouter} from "./routes/testing-router";
import {videoRouter} from "./routes/video-router";


export const app = express()

const jsonBodyMiddleWare = express.json()
app.use(jsonBodyMiddleWare)
app.use(SETTINGS.BASE_URL + "testing", testingRouter);
app.use(SETTINGS.BASE_URL + "videos", videoRouter);