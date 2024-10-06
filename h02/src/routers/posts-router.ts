import {postDbHandlerClass} from "../db-handlers/posts-db-handler";
import {validationResult} from "express-validator";
import {Request, Response, Router} from "express";
import {postValidation} from "../validations/post-validation";
import {validationParser} from "../validations/validation-parser";
import {authorization} from "../validations/authorization-validation";
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
postRouter.delete("/:id",
    authorization,
    (req, resp) =>{
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
postRouter.put("/:id",
    authorization,
    postValidation,
    validationParser,
    (req: Request, resp: Response) =>{
    const postId = req.params.id;

    if (!postId){
        resp
            .sendStatus(400)
        return;
    }
    const updatedPost = postDbHandler.updatePost(postId, req.body);

    if (!updatedPost){
        resp
            .sendStatus(404)
        return;
    }
    resp
        .status(200)
        .json(updatedPost)

})
postRouter.post("/",
    authorization,
    postValidation,
    validationParser,
    (req: Request, resp: Response) =>{
    const post = postDbHandler.createPost(req.body);
    resp
        .status(201)
        .json(post)
})