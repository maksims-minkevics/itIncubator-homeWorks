import express from 'express';
import {testingRouter} from "./routers/testing-router";
import {blogRouter} from "./routers/blogs-router";
import {postRouter} from "./routers/posts-router";
import dotenv from "dotenv";
import {userRouter} from "./models/user/routers";
import {authRouter} from "./routers/auth-router";
import {commentRouter} from "./routers/comments-router";
import cookieParser from 'cookie-parser'
import {sessionRouter} from "./models/session/routers";
import {activityAuditRouter} from "./routers/activity-audit-route";
import {consts} from "./app/global-consts";
dotenv.config();
export const app = express()
app.set('trust proxy', true);

const jsonBodyMiddleWare = express.json();
app.use(jsonBodyMiddleWare);
app.use(cookieParser());
app.use(process.env.BASE_URL + consts.TESTING_BASE_END_POINT, testingRouter);
app.use(process.env.BASE_URL + consts.POSTS_BASE_END_POINT, postRouter);
app.use(process.env.BASE_URL + consts.BLOGS_BASE_END_POINT, blogRouter);
app.use(process.env.BASE_URL + consts.USERS_BASE_END_POINT, userRouter);
app.use(process.env.BASE_URL + consts.AUTH_BASE_END_POINT, authRouter);
app.use(process.env.BASE_URL + consts.COMMENTS_BASE_END_POINT, commentRouter);
app.use(process.env.BASE_URL || 'api', sessionRouter);
app.use(process.env.BASE_URL + consts.ACTIVITY_AUDIT_COLLECTION, activityAuditRouter);