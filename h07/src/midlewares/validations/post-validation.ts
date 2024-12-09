import {checkSchema, CustomValidator} from "express-validator";
import {postDbHandlerClass} from "../../db-handlers/posts-db-handler";
import {NextFunction, Request, Response} from "express";
import {blogDbHandlerClass} from "../../db-handlers/blogs-db-handler";
const posDbHandler = new postDbHandlerClass();
const blogDbHandler = new blogDbHandlerClass();
export const postValidation = checkSchema({
    title: {
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 30
            }
        },
        isString: true
    },
    shortDescription: {
        trim: true,
        isLength:{
            options: {
                min: 1,
                max: 100
            }
        },
        isString: true
    },
    content: {
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 1000
            }
        },
        isString: true
    },
    blogId: {
        trim: true,
        isLength: {
            options: {
                min: 1
            }
        },
        isString: true,
        custom: {
            options: posDbHandler.checkId
        }
    }
});

export const queryIdValidation = async (req: Request, resp: Response, next: NextFunction)  =>{
    if (!req.params.id){
        resp
            .sendStatus(404)
        return;
    }
    const blog = await blogDbHandler.findBlogbyId(req.params.id);
    if (!blog){
        resp
            .sendStatus(404)
        return;
    }
    next();

}