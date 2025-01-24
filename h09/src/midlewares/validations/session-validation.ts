import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import {RefreshTokenMetaDataDbHandler} from "../../db-handlers/refresh-token-meta-data-db-handler";
dotenv.config();
const sessionDbHandler = new RefreshTokenMetaDataDbHandler();
export const sessionValidation= async (req: Request, resp: Response, next: NextFunction) => {
    if(!req.params.deviceId){
        return resp
            .sendStatus(401);
    }

    const isValidUser = await sessionDbHandler.get({userId: req.user.userId, deviceId: req.params.deviceId})
    console.log(isValidUser)
    if (!isValidUser?.length){
        return resp
            .sendStatus(403);
    }
    return next();
}