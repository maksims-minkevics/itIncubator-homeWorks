import {Router, Request, Response} from "express";
import {activityAuditDbHandler} from "../db-handlers/activity-audit-db-handler";
import {jwtRefreshTokenAuth} from "../midlewares/validations/authorization";
import {hwDataCollection} from "../app/db";

export const activityAuditRouter = Router();
const auditActivityDbHandler = new activityAuditDbHandler();

activityAuditRouter.get("/", jwtRefreshTokenAuth, async (req: Request, resp: Response) =>{
    const result = await auditActivityDbHandler.get(req.ip||"");
    return resp
        .status(200)
        .json(result);
});

activityAuditRouter.get("/homework-data", async (req: Request, resp: Response) =>{
    return resp
        .status(200)
        .json(await hwDataCollection.find().toArray())

});

activityAuditRouter.delete("/:id", async (req: Request, resp: Response) =>{

});

activityAuditRouter.put("/:id", async (req: Request, resp: Response) =>{

});