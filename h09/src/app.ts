import express from 'express';
import {testingRouter} from "./models/testing/testing-router";
import {postRouter} from "./models/post/router";
import dotenv from "dotenv";
import {userRouter} from "./models/user/routers";
import cookieParser from 'cookie-parser'
import {sessionRouter} from "./models/session/routers";
import {BASE_URL, consts} from "./general/global-consts";
import {commentRouter} from "./models/comment/router";
import {blogRouter} from "./models/blog/router";
import {authRouter} from "./models/auth/router";
dotenv.config();
export const app = express()
app.set('trust proxy', true);

const jsonBodyMiddleWare = express.json();
app.use(jsonBodyMiddleWare);
app.use(cookieParser());
app.use(BASE_URL, testingRouter);
app.use(BASE_URL, postRouter);
app.use(BASE_URL, blogRouter);
app.use(BASE_URL, userRouter);
app.use(BASE_URL, authRouter);
app.use(BASE_URL, commentRouter);
app.use(BASE_URL, sessionRouter);
