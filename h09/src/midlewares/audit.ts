import {Request, Response, NextFunction} from "express";
import {activityAuditDbHandler} from "../db-handlers/activity-audit-db-handler";
import {ActivityAuditDbModel} from "../app/index";
const auditActivityDbHandler = new activityAuditDbHandler();
export const requestCounter = async (req: Request, resp: Response, next: NextFunction)=> {
    const tenSecondsAgo = new Date(new Date().getTime() - 10 * 1000);
    const result: ActivityAuditDbModel[] | [] = await auditActivityDbHandler.getByDate(
        req.ip || "",
        tenSecondsAgo
    );
    if (result && result.length > 5){
        return resp
            .sendStatus(429);
    }
    const a = await auditActivityDbHandler.create(
        req.originalUrl,
        new Date(),
        req.ip || ""
    );
    next();
    return ;
}