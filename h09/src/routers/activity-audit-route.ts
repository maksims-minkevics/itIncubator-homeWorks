import {Router, Request, Response} from "express";
import {activityAuditDbHandler} from "../db-handlers/activity-audit-db-handler";
import {jwtRefreshTokenAuth} from "../midlewares/validations/authorization";
<<<<<<< Updated upstream
=======
import {hwDataCollection} from "../app/db";
import jwt from "jsonwebtoken";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

export const activityAuditRouter = Router();
const auditActivityDbHandler = new activityAuditDbHandler();

activityAuditRouter.get("/", jwtRefreshTokenAuth, async (req: Request, resp: Response) =>{
    const result = await auditActivityDbHandler.get(req.ip||"");
    return resp
        .status(200)
        .json(result);
});

<<<<<<< Updated upstream
activityAuditRouter.get("/:id", async (req: Request, resp: Response) =>{
=======
activityAuditRouter.get("/homework-data", async (req: Request, resp: Response) =>{
    return resp
        .sendStatus(200)
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

});

activityAuditRouter.delete("/:id", async (req: Request, resp: Response) =>{

});

activityAuditRouter.put("/:id", async (req: Request, resp: Response) =>{

});