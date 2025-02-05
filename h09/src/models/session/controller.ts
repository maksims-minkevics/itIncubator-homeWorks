import { Request, Response } from "express";
import { sessionRepository } from "./repositories";

export const getActiveSessions = async (req: Request, res: Response) => {
    try {
        if (!req.user?.userId) {
            return res
                .status(401)
                .end();
        }

        const activeSessions = await sessionRepository.findActiveSessions(req.user.userId);

        if (!activeSessions.length) {
            return res
                .status(404)
                .end();
        }

        return res
            .status(200)
            .json(activeSessions);

    } catch (error) {
        console.error("Error in getActiveSessions:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};

export const deleteAllExceptCurrent = async (req: Request, res: Response) => {
    try {
        if (!req.deviceId || !req.user?.userId) {
            return res
                .status(400)
                .end();
        }

        const areAllSessionsDeactivated = await sessionRepository.deleteAllExceptCurrent(
            req.deviceId,
            req.user.userId
        );

        if (!areAllSessionsDeactivated) {
            return res
                .status(404)
                .end();
        }

        return res.status(204).end();
    } catch (error) {
        console.error("Error in deleteAllExceptCurrent:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};

export const deleteById = async (req: Request, res: Response) => {
    try {
        if (!req.params.deviceId || !req.user?.userId) {
            return res
                .status(400)
                .end();
        }

        const isSessionDeactivated = await sessionRepository.delete(
            req.params.deviceId,
            req.user.userId
        );

        if (!isSessionDeactivated) {
            return res
                .status(404)
                .end();
        }

        return res
            .status(204)
            .end();

    } catch (error) {
        console.error("Error in deleteById:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error" });
    }
};
