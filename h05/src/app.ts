import express from 'express';
import {testingRouter} from "./routers/testing-router";
import {blogRouter} from "./routers/blogs-router";
import {postRouter} from "./routers/posts-router";
import dotenv from "dotenv";
import {userRouter} from "./routers/users-router";
dotenv.config();
export const app = express()


const jsonBodyMiddleWare = express.json()
app.use(jsonBodyMiddleWare)
app.use(process.env.BASE_URL + "testing", testingRouter);
app.use(process.env.BASE_URL + "posts", postRouter);
app.use(process.env.BASE_URL + "blogs", blogRouter);
app.use(process.env.BASE_URL + "users", userRouter);