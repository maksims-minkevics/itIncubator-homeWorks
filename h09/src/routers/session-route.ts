import {Request, Response, Router} from "express";
import dotenv from "dotenv";
import {RefreshTokenMetaDataDbHandler} from "../db-handlers/refresh-token-meta-data-db-handler";
import {jwtRefreshTokenAuth} from "../midlewares/validations/authorization";
import {validationParser} from "../midlewares/validations/validation-parser";
import {getFormattedDate} from "../app/utilities";
import {sessionValidation} from "../midlewares/validations/session-validation";
import {consts} from "../app/global-consts";
dotenv.config()
export const sessionRouter = Router({});
const sessionDbHandler = new RefreshTokenMetaDataDbHandler();
sessionRouter.get(consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES,
    jwtRefreshTokenAuth,
    validationParser,
    async (req:Request, resp: Response)=>{
        const allActiveSessions = await sessionDbHandler.getAllActiveSessions(req.user.userId);
        console.log("----------------------------TECH DATA----------------------------------")
        console.log("URL", req.originalUrl)
        console.log("method", req.method)
        console.log("ip", req.ip)
        console.log("user-agent", req.headers['user-agent'])
        console.log("parsed token", req.refreshToken)
        console.log("deviceId", req.deviceId)
        console.log("user", req.user)
        console.log("----------------------------RESP----------------------------------")
        console.log("resp", allActiveSessions)
        console.log("----------------------------RESP----------------------------------")
        if(!allActiveSessions){
            console.log("status code", 404)
            console.log("----------------------------END----------------------------------")
            return resp.sendStatus(404);
        }
        console.log("status code", 200)
        console.log("----------------------------END----------------------------------")
        return resp
            .status(200)
            .json(allActiveSessions);

});

sessionRouter.delete(consts.END_POINTS.SESSION.DELETE,
    jwtRefreshTokenAuth,
    validationParser,
    async (req:Request, resp: Response)=>{
        const areAllSesstionsDeactivated = await sessionDbHandler.deleteAllExceptCurrent(
            req.deviceId,
            req.user.userId,
        );
        console.log("----------------------------TECH DATA----------------------------------")
        console.log("URL", req.originalUrl)
        console.log("method", req.method)
        console.log("ip", req.ip)
        console.log("user-agent", req.headers['user-agent'])
        console.log("parsed token", req.refreshToken)
        console.log("deviceId", req.deviceId)
        console.log("user", req.user)
        if(!areAllSesstionsDeactivated){
            console.log("status code", 404)
            console.log("----------------------------END----------------------------------")
            return resp.sendStatus(404);
        }
        console.log("status code", 204)
        console.log("----------------------------END----------------------------------")
        return resp
            .sendStatus(204)
});

sessionRouter.delete(consts.END_POINTS.SESSION.DELETE_BY_ID,
    jwtRefreshTokenAuth,
    sessionValidation,
    validationParser,
    async (req:Request, resp: Response)=>{
        const isSesstionDeactivated = await sessionDbHandler.delete(
            req.params.deviceId,
            req.user.userId
            );
        console.log("----------------------------TECH DATA----------------------------------")
        console.log("URL", req.originalUrl)
        console.log("method", req.method)
        console.log("ip", req.ip)
        console.log("user-agent", req.headers['user-agent'])
        console.log("parsed token", req.refreshToken)
        console.log("deviceId", req.deviceId)
        console.log("user", req.user)
        console.log("----------------------------TECH DATA----------------------------------")
        if(!isSesstionDeactivated){
            console.log("status code", 404)
            console.log("----------------------------END----------------------------------")
            return resp.sendStatus(404);
        }
        console.log("status code", 204)
        console.log("----------------------------END----------------------------------")
        return resp
            .sendStatus(204)

});