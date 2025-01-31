import {Router, Request, Response} from "express";
import {activityAuditDbHandler} from "../db-handlers/activity-audit-db-handler";
import {jwtRefreshTokenAuth} from "../midlewares/validations/authorization";
import {hwDataDbHandler} from "../db-handlers/home-work";

export const activityAuditRouter = Router();
const auditActivityDbHandler = new activityAuditDbHandler();
const homeWorkDbHand = new hwDataDbHandler();
activityAuditRouter.get("/", jwtRefreshTokenAuth, async (req: Request, resp: Response) =>{
    const result = await auditActivityDbHandler.get(req.ip||"");
    return resp
        .status(200)
        .json(result);
});

activityAuditRouter.get("/home-work-data", async (req: Request, resp: Response) =>{
    return resp
        .status(200)
        .json(await homeWorkDbHand.get())



});

activityAuditRouter.delete("/:id", async (req: Request, resp: Response) =>{

});

activityAuditRouter.put("/:id", async (req: Request, resp: Response) =>{

});