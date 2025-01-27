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
        if(!allActiveSessions){
            return resp.sendStatus(404);
        }
        return resp
            .status(200)
            .json(allActiveSessions);

});

sessionRouter.delete(consts.END_POINTS.SESSION.DELETE,
    jwtRefreshTokenAuth,
    validationParser,
    async (req:Request, resp: Response)=>{
        const areAllSesstionsDeactivated = await sessionDbHandler.updateAllExceptCurrent(
            req.deviceId,
            req.user.userId,
            {expireAt: await getFormattedDate()}
        );
        if(!areAllSesstionsDeactivated){
            return resp.sendStatus(404);
        }
        return resp
            .sendStatus(204)
});

sessionRouter.delete(consts.END_POINTS.SESSION.DELETE_BY_ID,
    jwtRefreshTokenAuth,
    sessionValidation,
    validationParser,
    async (req:Request, resp: Response)=>{
        const isSesstionDeactivated = await sessionDbHandler.updateSession(req.params.deviceId,
            {expireAt: await getFormattedDate()},
            false);
        if(!isSesstionDeactivated){
            return resp.sendStatus(404);
        }
        return resp
            .sendStatus(204)

});