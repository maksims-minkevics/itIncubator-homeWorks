import { NextFunction, Request, Response } from "express";
import {sessionServiceInstance} from "../../general/composition-root";
import {HTTP_STATUS} from "../../general/global-consts";

export const checkSessionAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { deviceId } = req.params;

        if (!deviceId) {
            return res
                .status(401)
                .json({ message: "Device ID is required" });
        }

        const session = await sessionServiceInstance.findOne({ deviceId });

        if (!session.data) {
            return res
                .status(HTTP_STATUS.NOT_FOUND)
                .json({ message: "Session not found" });
        }

        if (session.data.userId !== req.user.userId) {
            return res
                .status(HTTP_STATUS.FORBIDEN)
                .json({ message: "Access denied" });
        }

        return next();
    } catch (error) {
        console.error("Error in validateSessionOwnership middleware:", error);
        return res
            .status(HTTP_STATUS.SERVER_ERROR)
            .json({ message: "Internal Server Error" });
    }
};
