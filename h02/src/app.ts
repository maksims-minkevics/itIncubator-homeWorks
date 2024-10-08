import express from 'express';
import {testingRouter} from "./routers/testing-router";
import {blogRouter} from "./routers/blogs-router";
import {postRouter} from "./routers/posts-router";


export const app = express()

const jsonBodyMiddleWare = express.json()
app.use(jsonBodyMiddleWare)
app.use(process.env.BASE_URL + "testing", testingRouter);
app.use(process.env.BASE_URL + "posts", postRouter);
app.use(process.env.BASE_URL + "blogs", blogRouter);