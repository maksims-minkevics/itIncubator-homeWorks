import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {SETTINGS} from "../settings";
export const authorization = (req: Request, resp: Response, next: NextFunction) =>{
    const authorizationBase64 = req.headers.authorization;

    if (("Basic "+ btoa(SETTINGS.SUPER_SECRET_NAME + ":" + SETTINGS.SUPER_SECRET_PSWRD)) !== authorizationBase64){
        resp
            .sendStatus(401)
        return;
    }
    next();
}