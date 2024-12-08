import { Router, Response, Request } from "express";
import { blogDbHandlerClass } from "../db-handlers/blogs-db-handler";
import { blogValidation } from "../midlewares/validations/blog-validation";
import { validationParser } from "../midlewares/validations/validation-parser";
import {authorization1} from "../midlewares/validations/authorization";
import { postDbHandlerClass } from "../db-handlers/posts-db-handler";
import {postValidation, queryIdValidation} from "../midlewares/validations/post-validation";
import { blogIdExtander } from "../midlewares/extanders/blog-id-extander";
import {getBlogParamExtander} from "../midlewares/extanders/get-req-param-extanders";
import {queryIdValidator} from "../midlewares/validations/req-query-id-check";

export const blogRouter = Router({});
const blogDbHandler = new blogDbHandlerClass();
const postDbHandler = new postDbHandlerClass();

blogRouter.get("/",
    getBlogParamExtander,
    async (req, resp) => {
        return resp
            .status(200)
            .json(await blogDbHandler.
            getAllBlogs(
                req.query.searchNameTerm as string,
                req.query.sortBy as string,
                +(req.query.sortDirection as string),
                +(req.query.pageNumber as string),
                +(req.query.pageSize as string)
            ));

});

blogRouter.get("/:id",
    queryIdValidator,
    async (req, resp) => {
        const blogId = req.params.id;
        const blog = await blogDbHandler.findBlogbyId(blogId);

        if (!blog) {
            resp.sendStatus(404);
            return;
        }

        return resp
            .status(200)
            .json(blog);
});

blogRouter.delete("/:id",
    authorization1,
    queryIdValidator,
    async (req: Request, resp: Response) => {
        const blogId = req.params.id;
        const deletedBlogId = await blogDbHandler.deleteblog(blogId);

        if (!deletedBlogId) {
            resp.sendStatus(404);
            return;
        }
        resp.sendStatus(204);
        return
});

blogRouter.put("/:id",
    authorization1,
    queryIdValidator,
    blogValidation,
    validationParser,
    async (req: Request, resp: Response) => {
        const blogId = req.params.id;
        const updatedBlog = await blogDbHandler.updateBlog(blogId, req.body);
        if (!updatedBlog) {
            resp.sendStatus(404);
            return;
        }
        resp.sendStatus(204);
        return
});

blogRouter.post("/",
    authorization1,
    blogValidation,
    validationParser,
    async (req: Request, resp: Response) => {
        const blog = await blogDbHandler.createBlog(req.body);
        return resp
            .status(201)
            .json(blog);
});


blogRouter.post(
    "/:id/posts",
    authorization1,
    queryIdValidator,
    queryIdValidation,
    blogIdExtander,
    getBlogParamExtander,
    postValidation,
    validationParser,
    async (req: Request, resp: Response) => {
        const post = await postDbHandler.createPost(req.body);
        return resp
            .status(201)
            .json(post);
    }
);

blogRouter.get("/:id/posts",
    queryIdValidator,
    getBlogParamExtander,
    async (req: Request, resp: Response) => {
        const blogId = req.params.id;
        const posts = await postDbHandler.findPostsByBlogId(
            blogId,
            req.query.sortBy as string,
            +(req.query.sortDirection as string),
            +(req.query.pageNumber as string),
            +(req.query.pageSize as string)
        );

        if (posts.totalCount === 0) {
            resp.sendStatus(404);
            return;
        }

        return resp
            .status(200)
            .json(posts);
});
