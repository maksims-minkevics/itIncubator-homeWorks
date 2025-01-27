import {postDbHandlerClass} from "../db-handlers/posts-db-handler";
import {Request, Response, Router} from "express";
import {postValidation} from "../midlewares/validations/post-validation";
import {validationParser} from "../midlewares/validations/validation-parser";
import {authorization1, jwtTokenAuth} from "../midlewares/validations/authorization";
import {getBlogQueryExtander} from "../midlewares/extanders/req-query-extanders";
import {commentDbHandlerClass} from "../db-handlers/comment-db-handler";
import {queryIdValidator} from "../midlewares/validations/req-query-id-check";
import {commentValidation} from "../midlewares/validations/comment-validation";
import {consts} from "../app/global-consts";
export const postRouter = Router({});
const postDbHandler = new postDbHandlerClass();
const commentDbHandler = new commentDbHandlerClass();

postRouter.get(
    consts.END_POINTS.POSTS.GET,
    getBlogQueryExtander,
    async (req, resp) => {
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
postRouter.get(
    consts.END_POINTS.POSTS.GET_BY_ID,
    async (req, resp) => {
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
postRouter.delete(
    consts.END_POINTS.POSTS.DELETE_BY_ID,
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
postRouter.put(
    consts.END_POINTS.POSTS.UPDATE_BY_ID,
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
postRouter.post(
    consts.END_POINTS.POSTS.CREATE,
    authorization1,
    postValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
        const post = await postDbHandler.createPost(req.body);
        return resp
            .status(201)
            .json(post);
})

postRouter.post(
    consts.END_POINTS.POSTS.CREATE_COMMENT_FOR_SPECIFIC_POST,
    jwtTokenAuth,
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

postRouter.get(
    consts.END_POINTS.POSTS.GET_COMMENTS_FOR_SPECIFIC_POST,
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