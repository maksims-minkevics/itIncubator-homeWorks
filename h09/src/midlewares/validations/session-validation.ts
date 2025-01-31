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

    const isValidUser = await sessionDbHandler.getOne(
        {
            deviceId: req.params.deviceId
        }
    )
    if (!isValidUser){
        return resp
            .sendStatus(404);
    }
    if (isValidUser.userId !== req.user.userId){
        return resp
            .sendStatus(403);
    }
    return next();
}