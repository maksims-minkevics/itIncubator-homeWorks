import {NextFunction, Request, Response} from "express";

export const authorization = (req: Request, resp: Response, next: NextFunction) =>{
    const authorizationBase64 = req.headers.authorization;

    if (("Basic "+ btoa(process.env.SUPER_SECRET_NAME + ":" + process.env.SUPER_SECRET_PSWRD)) !== authorizationBase64){
        resp
            .sendStatus(401)
        return;
    }
    next();
}