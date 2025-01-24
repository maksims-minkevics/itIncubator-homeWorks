import {Request, Response, NextFunction} from "express";
import {activityAuditDbHandler} from "../../db-handlers/activity-audit-db-handler";
const auditActivityDbHandler = new activityAuditDbHandler();
export const requestCounter = async (req: Request, resp: Response, next: NextFunction)=> {
    const tenSecondsAgo = new Date(new Date().getTime() - 10 * 1000);
    const result = await auditActivityDbHandler.getByDate(req.deviceId, req.user.userId, tenSecondsAgo);
    console.log(req.baseUrl);
    next();
}