import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import {RefreshTokenMetaDataDbHandler} from "../../db-handlers/refresh-token-meta-data-db-handler";
dotenv.config();
const sessionDbHandler = new RefreshTokenMetaDataDbHandler();
export const sessionValidation= async (req: Request, resp: Response, next: NextFunction) => {
    console.log("------------------------sessionValidation START------------------------------")
    if(!req.params.deviceId){
        console.log("----------------------------TECH DATA----------------------------------")
        console.log("URL", req.originalUrl)
        console.log("method", req.method)
        console.log("ip", req.ip)
        console.log("user-agent", req.headers['user-agent'])
        console.log("parsed token", req.refreshToken)
        console.log("deviceId", req.deviceId)
        console.log("user", req.user)
        console.log("----------------------------TECH DATA----------------------------------")
        console.log("status code", 401)
        console.log("---------------------------- sessionValidation END----------------------------------")
        return resp
            .sendStatus(401);
    }

    const isValidUser = await sessionDbHandler.getOne(
        {
            deviceId: req.params.deviceId
        }
    )
    if (!isValidUser){
        console.log("----------------------------TECH DATA----------------------------------")
        console.log("URL", req.originalUrl)
        console.log("method", req.method)
        console.log("ip", req.ip)
        console.log("user-agent", req.headers['user-agent'])
        console.log("parsed token", req.refreshToken)
        console.log("deviceId", req.deviceId)
        console.log("user", req.user)
        console.log("----------------------------TECH DATA----------------------------------")
        console.log("status code", 404)
        console.log("---------------------------- sessionValidation END----------------------------------")
        return resp
            .sendStatus(404);
    }
    if (isValidUser.userId !== req.user.userId){
        console.log("----------------------------TECH DATA----------------------------------")
        console.log("URL", req.originalUrl)
        console.log("method", req.method)
        console.log("ip", req.ip)
        console.log("user-agent", req.headers['user-agent'])
        console.log("parsed token", req.refreshToken)
        console.log("deviceId", req.deviceId)
        console.log("user", req.user)
        console.log("----------------------------TECH DATA----------------------------------")
        console.log("status code", 403)
        console.log("---------------------------- sessionValidation END----------------------------------")
        return resp
            .sendStatus(403);
    }
    console.log("---------------------------- sessionValidation END (OK)----------------------------------")
    return next();
}