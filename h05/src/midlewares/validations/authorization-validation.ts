import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
dotenv.config();

export const authorization = (req: Request, resp: Response, next: NextFunction) =>{
    const authorizationBase64 = req.headers.authorization;
    if (!req.headers.authorization)
    {
        resp
            .sendStatus(400)
        return;
    }

    if (("Basic "+ btoa(process.env.SUPER_SECRET_NAME + ":" + process.env.SUPER_SECRET_PSWRD)) !== authorizationBase64){
        resp
            .sendStatus(401)
        return;
    }
    next();
}