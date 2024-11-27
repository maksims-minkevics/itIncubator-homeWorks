import {Router} from "express";
import {blogDbHandlerClass} from "../db-handlers/blogs-db-handler";
import {postDbHandlerClass} from "../db-handlers/posts-db-handler";
import {userDbHandlerClass} from "../db-handlers/user-db-handler";


export const testingRouter = Router({});

testingRouter.delete("/all-data", (req, resp) =>{
    const blogDbHandler = new blogDbHandlerClass();
    const postDbHandler = new postDbHandlerClass();
    const userDbHandler = new userDbHandlerClass();
    blogDbHandler.dropDb();
    postDbHandler.dropDb();
    userDbHandler.dropDb();
    resp
        .sendStatus(204)

})