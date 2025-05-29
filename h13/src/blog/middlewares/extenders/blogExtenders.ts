import {NextFunction, Request, Response} from "express";


export const getBlogIdFromReq = (req: Request, resp: Response, next: NextFunction) => {
    const blogId = req.params.id;
    if (blogId){
        req.body.blogId = blogId;
    }
    next();
    return
}