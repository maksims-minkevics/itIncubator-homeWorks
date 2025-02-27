import {Request, Response} from "express";
import {HTTP_STATUS} from "../../general/global-consts";
import {settings} from "../../settings";
import {authService} from "./services/authService";
import {userService} from "../user/services/userService";
import {registrationService} from "./services/registrationService";

export class AuthController {
    static async login(req: Request, resp: Response) {
        try {
            const agent = req.headers["user-agent"] || ""
            const result = await authService.login(
                req.ip as string,
                agent,
                req.user
                )
            if (!result.status){
                throw Error("Invalid Data")
            }

            if (!result.data){
                throw Error("Invalid Data")
            }
            resp.cookie("refreshToken", result.data.refreshToken, settings.REFRESH_TOKEN_PARAMETERS)
            return resp
                .status(HTTP_STATUS.OK)
                .json({
                    accessToken: result.data.accessToken
                })

        } catch (error) {
            console.error("Error in AuthController login:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };
    static async getActiveUser(req: Request, resp: Response) {
        try {
            const result = await userService.findByEmailOrLogin(req.user.userLogin, req.user.userLogin);
            if (!result.status || result.data === null){
                throw Error("Incorrect Data")
            }
            return resp
                .status(HTTP_STATUS.OK)
                .json(result.data);

        } catch (error) {
            console.error("Error in AuthController getActiveUser:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    static async confirmRegistration(req: Request, resp: Response) {
        try {
            const result = await registrationService.confirmRegistration(req.body.code);
            if(!result.status && result.data === null){
                return resp
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .end();
            }

            if(!result.status && result.data !== null){
                return resp
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .json(result.data);
            }

            return resp
                .status(HTTP_STATUS.NO_CONTENT)
                .end();
        } catch (error) {
            console.error("Error in AuthController confirmRegistration:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    static async registration(req: Request, resp: Response) {
        try {
                const result = await registrationService.newUserRegistration(req.body);
                if (!result.status) {
                    return resp
                        .status(HTTP_STATUS.BAD_REQUEST)
                        .json(result.msg)
                }
                return resp
                    .status(HTTP_STATUS.NO_CONTENT)
                    .end();

        } catch (error) {
            console.error("Error in AuthController registration:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    static async resendConfirmEmail(req: Request, resp: Response) {
        try {
            const result = await registrationService.resendConfirmationCode(req.body);
            if (!result.status){
                return resp
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .json(result.data)
            }
            return resp
                .status(HTTP_STATUS.NO_CONTENT)
                .end();

        } catch (error) {
            console.error("Error in AuthController resendEmail:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    static async refreshToken(req: Request, resp: Response) {
        try {

            const result = await authService.refreshToken(
                req.ip as string,
                req.deviceId,
                req.user
            );
            if (!result.status){
                throw Error("Invalid Data")
            }

            if (!result.data){
                throw Error("Invalid Data")
            }
            resp.cookie("refreshToken", result.data.refreshToken, settings.REFRESH_TOKEN_PARAMETERS)
            return resp
                .status(HTTP_STATUS.OK)
                .json({
                    accessToken: result.data.accessToken
                })

        } catch (error) {
            console.error("Error in AuthController refreshToken:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    static async logOut(req: Request, resp: Response) {
        try {
            const deviceId = req.deviceId;
            const userId = req.user.userId
            const result = await authService.logOut(deviceId, userId);
            if (!result.status){
                throw new Error("Invalid Data")
            }
            resp.clearCookie("refreshToken");
            return resp
                .sendStatus(HTTP_STATUS.NO_CONTENT);
        } catch (error) {
            console.error("Error in AuthController logOut:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

}