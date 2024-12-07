import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
dotenv.config();


export const queryIdValidator = (req: Request, resp: Response, next: NextFunction) =>{
    const id= req.params.id;
    if (!id){
        resp
            .sendStatus(404);
        return;
    }
    next();
}