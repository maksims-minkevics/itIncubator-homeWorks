import {postDbHandlerClass} from "../db-handlers/posts-db-handler";
import {Request, Response, Router} from "express";
import {postValidation} from "../midlewares/validations/post-validation";
import {validationParser} from "../midlewares/validations/validation-parser";
import {authorization1} from "../midlewares/validations/authorization-validation";
import {getBlogParamExtander} from "../midlewares/extanders/get-req-param-extanders";
export const postRouter = Router({});
const postDbHandler = new postDbHandlerClass();
postRouter.get("/", getBlogParamExtander, async (req, resp) => {
    resp
        .status(200)
        .json(await postDbHandler.
        getAllPosts(
            req.query.sortBy as string,
            +(req.query.sortDirection as string),
            +(req.query.pageNumber  as string),
            +(req.query.pageSize as string)
        ));
});
postRouter.get("/:id", async (req, resp) => {
    const postId = req.params.id;

    if (!postId){
        resp
            .sendStatus(404)
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
    authorization1,
    async (req: Request, resp: Response) =>{
    const postId = req.params.id;

    if (!postId){
        resp
            .sendStatus(404)
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
    authorization1,
    postValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
    const postId = req.params.id;

    if (!postId){
        resp
            .sendStatus(404)
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
    authorization1,
    postValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
    const post = await postDbHandler.createPost(req.body);
    resp
        .status(201)
        .json(post)
})