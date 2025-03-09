import {Request, Response, NextFunction} from "express";
import {activityAuditDbHandler} from "../db-handlers/activity-audit-db-handler";
import {ActivityAuditDbModel} from "../general/index";
import {consts, HTTP_STATUS} from "../general/global-consts";
const auditActivityDbHandler = new activityAuditDbHandler();
export const requestCounter = async (req: Request, resp: Response, next: NextFunction)=> {
    const a = await auditActivityDbHandler.create(
        req.originalUrl,
        new Date(),
        req.ip || ""
    );
    const tenSecondsAgo = new Date(new Date().getTime() - 10 * 1000);
    const result: ActivityAuditDbModel[] | [] = await auditActivityDbHandler.getByDate(
        req.ip || "",
        tenSecondsAgo,
        req.originalUrl
    );
    //console.log(`\x1b[34mRequest count - ${result.length}\x1b[0m`);
    if (result && result.length > consts.REQUEST_COUNT){
        return resp
            .status(HTTP_STATUS.TOO_MANY_REQUESTS)
            .end();
    }
    next();
    return ;
}