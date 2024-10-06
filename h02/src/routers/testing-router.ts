import {Router} from "express";
import {blogDbHandlerClass} from "../db-handlers/blogs-db-handler";
import {postDbHandlerClass} from "../db-handlers/posts-db-handler";


export const testingRouter = Router({});

testingRouter.delete("/all-data", (req, resp) =>{
    const blogDbHandler = new blogDbHandlerClass();
    const postDbHandler = new postDbHandlerClass();
    blogDbHandler.dropDb();
    postDbHandler.dropDb()
    resp
        .sendStatus(204)

})