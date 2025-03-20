import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import {HTTP_STATUS} from "../../../../general/global-consts";
dotenv.config();


export const queryIdValidator = (req: Request, resp: Response, next: NextFunction) =>{
    const id= req.params.id;
    if (!id){
        resp
            .status(HTTP_STATUS.NOT_FOUND)
            .end();
        return;
    }
    next();
}