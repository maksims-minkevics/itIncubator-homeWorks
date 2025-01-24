import {Router, Request, Response} from "express";
import {activityAuditDbHandler} from "../db-handlers/activity-audit-db-handler";
import {jwtRefreshTokenAuth} from "../midlewares/validations/authorization";

export const activityAuditRouter = Router();
const auditActivityDbHandler = new activityAuditDbHandler();

activityAuditRouter.get("/", jwtRefreshTokenAuth, async (req: Request, resp: Response) =>{
    const result = await auditActivityDbHandler.get(req.deviceId, req.user.userId);
    return resp
        .status(200)
        .json(result);
});

activityAuditRouter.get("/:id", async (req: Request, resp: Response) =>{

});

activityAuditRouter.delete("/:id", async (req: Request, resp: Response) =>{

});

activityAuditRouter.put("/:id", async (req: Request, resp: Response) =>{

});