import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {HTTP_STATUS} from "../../../general/global-consts";


export const objectIdValidator = (req: Request, resp: Response, next: NextFunction) => {
    const _id = req.params.id
    if (!_id){
        next();
        return;
    }

    if(!ObjectId.isValid(_id)){
        return resp
            .status(HTTP_STATUS.NOT_FOUND)
            .end();
    }
    next();
    return ;

}