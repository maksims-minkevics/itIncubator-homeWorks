import {Request, Response, NextFunction} from "express";
import {consts, HTTP_STATUS} from "../../../general/global-consts";
export const requestCounter = async (req: Request, resp: Response, next: NextFunction)=> {
    await auditActivityDbHandler.create(
        req.originalUrl,
        new Date(),
        req.ip || ""
    );

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