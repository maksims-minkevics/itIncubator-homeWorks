import { Request, Response } from "express";
import { sessionService } from "./services/sessionServices";
import {HTTP_STATUS, SERVICE_CUSTOM_MSG} from "../../general/global-consts";

export class SessionController {
    static async getActiveSessions(req: Request, res: Response) {
        try {
            if (!req.user?.userId) {
                return res
                    .status(HTTP_STATUS.UNAUTHORIZED)
                    .end();
            }

            const activeSessions = await sessionService.getActiveSessions(req.user.userId);
            if (!activeSessions.status && activeSessions.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }

            return res
                .status(HTTP_STATUS.OK)
                .json(activeSessions.data);
        } catch (error) {
            console.error("Error in getActiveSessions:", error);
            return res
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({ message: "Internal Server Error" });
        }
    }

    static async deleteAllExceptCurrent(req: Request, res: Response) {
        try {
            if (!req.deviceId || !req.user.userId) {
                return res
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .end();
            }

            const isDeleted = await sessionService.deleteAllExceptCurrent(req.deviceId, req.user.userId);
            if (!isDeleted.status && isDeleted.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }

            return res
                .status(HTTP_STATUS.NO_CONTENT)
                .end();

        } catch (error) {
            console.error("Error in deleteAllExceptCurrent:", error);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }

    static async deleteById(req: Request, res: Response) {
        try {
            if (!req.params.deviceId || !req.user?.userId) {
                return res
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .end();
            }

            const isDeleted = await sessionService.deleteById(req.params.deviceId, req.user.userId);
            if (!isDeleted.status && isDeleted.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }

            return res
                .status(HTTP_STATUS.NO_CONTENT)
                .end();
        } catch (error) {
            console.error("Error in deleteById:", error);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }
}
