import express from 'express';
import {testingRouter} from "./routers/testing-router";
import {blogRouter} from "./routers/blogs-router";
import {postRouter} from "./routers/posts-router";
import dotenv from "dotenv";
import {userRouter} from "./routers/users-router";
import {authRouter} from "./routers/auth-router";
import {commentRouter} from "./routers/comments-router";
import cookieParser from 'cookie-parser'
import {sessionRouter} from "./routers/session-route";
import {activityAuditRouter} from "./routers/activity-audit-route";
import {requestCounter} from "./midlewares/audit";
dotenv.config();
export const app = express()
app.set('trust proxy', true);

const jsonBodyMiddleWare = express.json();
app.use(jsonBodyMiddleWare);
app.use(cookieParser());
app.use(requestCounter);
app.use(process.env.BASE_URL + "testing", testingRouter);
app.use(process.env.BASE_URL + "posts", postRouter);
app.use(process.env.BASE_URL + "blogs", blogRouter);
app.use(process.env.BASE_URL + "users", userRouter);
app.use(process.env.BASE_URL + "auth", authRouter);
app.use(process.env.BASE_URL + "comments", commentRouter);
app.use(process.env.BASE_URL + "security/devices", sessionRouter);
app.use(process.env.BASE_URL + "audit", activityAuditRouter);