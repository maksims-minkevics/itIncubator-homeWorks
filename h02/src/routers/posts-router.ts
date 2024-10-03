import {Router} from "express";
import {postDbHandlerClass} from "../db-handlers/posts-db-handler";
export const postRouter = Router({});
const postDbHandler = new postDbHandlerClass();

postRouter.get("/", (req, resp) => {
    resp
        .status(200)
        .json(postDbHandler.findPost())
})
postRouter.get("/:id", (req, resp) => {
    const postId = req.params.id;

    if (!postId){
        resp
            .sendStatus(400)
        return;
    }

    const post = postDbHandler.findPost(postId);

    if (!post){
        resp
            .sendStatus(404)
        return;
    }

    return resp
        .status(200)
        .json(post)

})
postRouter.delete("/:id", (req, resp) =>{
    const postId = req.params.id;

    if (!postId){
        resp
            .sendStatus(400)
        return;
    }
    const deletedPostgId = postDbHandler.deletePost(postId);

    if (!deletedPostgId){
        resp
            .sendStatus(404)
        return;
    }
    resp
        .status(200)
        .json(deletedPostgId)

})
postRouter.put("/:id", (req, resp) =>{
    const postId = req.params.id;

    if (!postId){
        resp
            .sendStatus(400)
        return;
    }
    const updatedPost = postDbHandler.updatePost(postId, req.body);

    if(Array.isArray(updatedPost)){
        resp
            .status(400)
            .json({"errorsMessages": updatedPost})
        return;

    }

    if (!updatedPost){
        resp
            .sendStatus(404)
        return;
    }
    resp
        .status(200)
        .json(updatedPost)

})
postRouter.post("/", (req, resp) =>{
    const post = postDbHandler.createPost(req.body);

    if (Array.isArray(post)){
        resp
            .status(400)
            .json({"errorsMessages": post})
        return;
    }

    resp
        .status(201)
        .json(post)
})