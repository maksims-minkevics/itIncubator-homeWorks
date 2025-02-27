import { NextFunction, Request, Response } from "express";
import { sessionRepository } from "./repositories";

export const checkSessionAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { deviceId } = req.params;

        if (!deviceId) {
            return res
                .status(401)
                .json({ message: "Device ID is required" });
        }

        const session = await sessionRepository.findOne({ deviceId });

        if (!session) {
            return res
                .status(404)
                .json({ message: "Session not found" });
        }

        if (session.userId !== req.user.userId) {
            return res
                .status(403)
                .json({ message: "Access denied" });
        }

        return next();
    } catch (error) {
        console.error("Error in validateSessionOwnership middleware:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};
