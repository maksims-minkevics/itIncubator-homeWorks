import {Router, Response, Request} from "express";
import {blogDbHandlerClass} from "../db-handlers/blogs-db-handler";
import {blogValidation} from "../validations/blog-validation";
import {validationParser} from "../validations/validation-parser";
import {authorization} from "../validations/authorization-validation";
export const blogRouter = Router({});
const blogDbHandler = new blogDbHandlerClass();

blogRouter.get("/", (req, resp) => {
    resp
        .status(200)
        .json(blogDbHandler.findBlog())
})
blogRouter.get("/:id", (req, resp) => {
    const blogId = req.params.id;

    if (!blogId){
        resp
            .sendStatus(400)
        return;
    }

    const blog = blogDbHandler.findBlog(blogId);

    if (!blog){
        resp
            .sendStatus(404)
        return;
    }

    return resp
        .status(200)
        .json(blog)

})
blogRouter.delete("/:id",
    authorization,
    (req, resp) =>{
    const blogId = req.params.id;

    if (!blogId){
        resp
            .sendStatus(400)
        return;
    }
    const deletedBlogId = blogDbHandler.deleteblog(blogId);

    if (!deletedBlogId){
        resp
            .sendStatus(404)
        return;
    }
    resp
        .sendStatus(204)

})
blogRouter.put("/:id",
    authorization,
    blogValidation,
    validationParser,
    (req: Request, resp: Response) =>{
    const blogId = req.params.id;

    if (!blogId){
        resp
            .sendStatus(400)
        return;
    }
    const updatedBlog = blogDbHandler.updateBlog(blogId, req.body);

    if(Array.isArray(updatedBlog)){
        resp
            .status(400)
            .json({"errorsMessages": updatedBlog})
        return;

    }

    if (!updatedBlog){
        resp
            .sendStatus(404)
        return;
    }
    resp
        .sendStatus(204)

})
blogRouter.post("/",
    authorization,
    blogValidation,
    validationParser,
    (req: Request, resp: Response) =>{
    const blog = blogDbHandler.createBlog(req.body);

    if (Array.isArray(blog)){
        resp
            .status(400)
            .json({"errorsMessages": blog})
        return;
    }

    resp
        .status(201)
        .json(blog)
})