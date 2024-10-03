import express from 'express';
import {SETTINGS} from "./settings";
import {testingRouter} from "./routers/testing-router";
import {blogRouter} from "./routers/blogs-router";
import {postRouter} from "./routers/posts-router";


export const app = express()

const jsonBodyMiddleWare = express.json()
app.use(jsonBodyMiddleWare)
app.use(SETTINGS.BASE_URL + "testing", testingRouter);
app.use(SETTINGS.BASE_URL + "posts", postRouter);
app.use(SETTINGS.BASE_URL + "blogs", blogRouter);