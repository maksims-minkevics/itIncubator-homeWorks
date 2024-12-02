import { Router, Response, Request } from "express";
import { blogDbHandlerClass } from "../db-handlers/blogs-db-handler";
import { blogValidation } from "../midlewares/validations/blog-validation";
import { validationParser } from "../midlewares/validations/validation-parser";
import { authorization } from "../midlewares/validations/authorization-validation";
import { postDbHandlerClass } from "../db-handlers/posts-db-handler";
import {postValidation, queryIdValidation} from "../midlewares/validations/post-validation";
import { blogIdExtander } from "../midlewares/extanders/blog-id-extander";
import {getBlogParamExtander} from "../midlewares/extanders/get-req-param-extanders";

export const blogRouter = Router({});
const blogDbHandler = new blogDbHandlerClass();
const postDbHandler = new postDbHandlerClass();
blogRouter.get("/", getBlogParamExtander, async (req, resp) => {
    resp
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

blogRouter.get("/:id", async (req, resp) => {
    const blogId = req.params.id;

    if (!blogId) {
        resp.sendStatus(400);
        return;
    }

    const blog = await blogDbHandler.findBlogbyId(blogId);

    if (!blog) {
        resp.sendStatus(404);
        return;
    }

    return resp.status(200).json(blog);
});

blogRouter.delete("/:id", authorization, async (req: Request, resp: Response) => {
    const blogId = req.params.id;

    if (!blogId) {
        resp.sendStatus(400);
        return;
    }

    const deletedBlogId = await blogDbHandler.deleteblog(blogId);

    if (!deletedBlogId) {
        resp.sendStatus(404);
        return;
    }
    resp.sendStatus(204);
});

blogRouter.put("/:id", authorization, blogValidation, validationParser, async (req: Request, resp: Response) => {
    const blogId = req.params.id;

    if (!blogId) {
        resp.sendStatus(400);
        return;
    }

    const updatedBlog = await blogDbHandler.updateBlog(blogId, req.body);
    if (!updatedBlog) {
        resp.sendStatus(404);
        return;
    }
    resp.sendStatus(204);
});

blogRouter.post("/", authorization, blogValidation, validationParser, async (req: Request, resp: Response) => {
    const blog = await blogDbHandler.createBlog(req.body);
    resp.status(201).json(blog);
});

blogRouter.post(
    "/:id/posts",
    authorization,
    queryIdValidation,
    blogIdExtander,
    getBlogParamExtander,
    postValidation,
    validationParser,
    async (req: Request, resp: Response) => {
        const post = await postDbHandler.createPost(req.body);
        resp.status(201).json(post);
    }
);

blogRouter.get("/:id/posts", queryIdValidation,getBlogParamExtander, async (req: Request, resp: Response) => {
    const blogId = req.params.id;
    const posts = await postDbHandler.findPostsbyBlogId(
        blogId,
        req.query.sortBy as string,
        +(req.query.sortDirection as string),
        +(req.query.pageNumber as string),
        +(req.query.pageSize as string)
    );

    if (!posts) {
        resp.sendStatus(404);
        return;
    }

    return resp.status(200).json(posts);
});
