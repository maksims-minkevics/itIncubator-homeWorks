import {postDbHandlerClass} from "../db-handlers/posts-db-handler";
import {validationResult} from "express-validator";
import {Request, Response, Router} from "express";
import {postValidation} from "../validations/post-validation";
import {validationParser} from "../validations/validation-parser";
import {authorization} from "../validations/authorization-validation";
export const postRouter = Router({});
const postDbHandler = new postDbHandlerClass();

postRouter.get("/", async (req, resp) => {
    resp
        .status(200)
        .json(await postDbHandler.getAllPosts())
})
postRouter.get("/:id", async (req, resp) => {
    const postId = req.params.id;

    if (!postId){
        resp
            .sendStatus(400)
        return;
    }

    const post = await postDbHandler.findPostbyId(postId);

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
    async (req, resp) =>{
    const postId = req.params.id;

    if (!postId){
        resp
            .sendStatus(400)
        return;
    }
    const isDeleted = await postDbHandler.deletePost(postId);

    if (!isDeleted){
        resp
            .sendStatus(404)
        return;
    }
    resp
        .sendStatus(204)

})
postRouter.put("/:id",
    authorization,
    postValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
    const postId = req.params.id;

    if (!postId){
        resp
            .sendStatus(400)
        return;
    }
    const updatedPost = await postDbHandler.updatePost(postId, req.body);

    if (!updatedPost){
        resp
            .sendStatus(404)
        return;
    }
    resp
        .sendStatus(204)

})
postRouter.post("/",
    authorization,
    postValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
    const post = await postDbHandler.createPost(req.body);
    resp
        .status(201)
        .json(post)
})