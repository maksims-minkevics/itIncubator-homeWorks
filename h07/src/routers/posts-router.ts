import {postDbHandlerClass} from "../db-handlers/posts-db-handler";
import {Request, Response, Router} from "express";
import {postValidation} from "../midlewares/validations/post-validation";
import {validationParser} from "../midlewares/validations/validation-parser";
import {authorization1, jwtTokenAuthorization} from "../midlewares/validations/authorization";
import {getBlogQueryExtander} from "../midlewares/extanders/req-query-extanders";
import {commentDbHandlerClass} from "../db-handlers/comment-db-handler";
import {queryIdValidator} from "../midlewares/validations/req-query-id-check";
import {commentValidation} from "../midlewares/validations/comment-validation";
export const postRouter = Router({});
const postDbHandler = new postDbHandlerClass();
const commentDbHandler = new commentDbHandlerClass();

postRouter.get("/", getBlogQueryExtander, async (req, resp) => {
    return resp
        .status(200)
        .json(await postDbHandler.
            getAllPosts(
                req.query.sortBy as string,
                +(req.query.sortDirection as string),
                +(req.query.pageNumber  as string),
                +(req.query.pageSize as string)
            )
        );
});
postRouter.get("/:id", async (req, resp) => {
    const postId = req.params.id;

    if (!postId){
        return resp
            .sendStatus(404);
    }

    const post = await postDbHandler.findPostById(postId);

    if (!post){
        return resp
            .sendStatus(404);
    }

    return resp
        .status(200)
        .json(post);
})
postRouter.delete("/:id",
    authorization1,
    async (req: Request, resp: Response) =>{
    const postId = req.params.id;

    if (!postId){
        return resp
            .sendStatus(404);
    }
    const isDeleted = await postDbHandler.deletePost(postId);

    if (!isDeleted){
        return resp
            .sendStatus(404);
    }
    return resp
        .sendStatus(204);

})
postRouter.put("/:id",
    authorization1,
    postValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
    const postId = req.params.id;

    if (!postId){
        return  resp
            .sendStatus(404);
    }
    const updatedPost = await postDbHandler.updatePost(postId, req.body);

    if (!updatedPost){
        return resp
            .sendStatus(404);
    }
    return resp
        .sendStatus(204);

})
postRouter.post("/",
    authorization1,
    postValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
    const post = await postDbHandler.createPost(req.body);
    return resp
        .status(201)
        .json(post);
})

postRouter.post("/:id/comments",
    jwtTokenAuthorization,
    commentValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
        const comment = await commentDbHandler.create(req.body, req.user, req.params.id)
        if(!comment){
            return resp
                .sendStatus(404);
        }
        return resp
            .status(201)
            .json(comment);
    })

postRouter.get("/:id/comments",
    getBlogQueryExtander,
    queryIdValidator,
    validationParser,
    async (req: Request, resp: Response) =>{
        const comments = await commentDbHandler.getByPostId(
            req.params.id,
            req.query.sortBy as string,
            +(req.query.sortDirection as string),
            +(req.query.pageNumber  as string),
            +(req.query.pageSize as string)
        )
        if(comments.totalCount === 0){
            return resp
                .sendStatus(404);
        }
        return resp
            .status(200)
            .json(comments);
    })