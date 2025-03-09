import {Request, Response} from 'express';
import {HTTP_STATUS} from "../../general/global-consts";
import {settings} from "../../settings";
import {AuthService} from "./services/authService";
import {UserService} from "../user/services/userService";
import {RegistrationService} from "./services/registrationService";

export class AuthController {
    constructor(
        protected authService: AuthService,
        protected userService: UserService,
        protected registrationService: RegistrationService

    ) {}
    async login(req: Request, resp: Response) {
        try {
            const agent = req.headers["user-agent"] || ""
            const result = await this.authService.login(
                req.ip as string,
                agent,
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
            console.error("Error in AuthController login:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    async getActiveUser(req: Request, resp: Response) {
        try {
            const result = await this.userService
                .findByEmailOrLogin(req.user.userLogin, req.user.userLogin);
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

    async confirmRegistration(req: Request, resp: Response) {
        try {
            console.log(req.body.code)
            const result = await this.registrationService.confirmRegistration(req.body.code);
            if(!result.status){
                return resp
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .end();
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

    async registration(req: Request, resp: Response) {
        try {
            const result = await this.registrationService.newUserRegistration(req.body);
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

    async resendConfirmEmail(req: Request, resp: Response) {
        try {
            const result = await this.registrationService.resendConfirmationCode(req.body.email);
            if (!result.status){
                return resp
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .json(result.msg)
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

    async refreshToken(req: Request, resp: Response) {
        try {

            const result = await this.authService.refreshToken(
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

    async logOut(req: Request, resp: Response) {
        try {
            const deviceId = req.deviceId;
            const userId = req.user.userId
            const result = await this.authService.logOut(deviceId, userId);
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

    async pswrdRecovery(req: Request, resp: Response){
        try {
            await this.authService.pswrdRecovery(req.body.email);

            return resp
                .status(HTTP_STATUS.NO_CONTENT)
                .end();
        } catch (error) {
            console.error("Error in AuthController recoveryPassword:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }

    };

    async confirmNewPassword(req: Request, resp: Response){
        try {
            const result = await this.authService.confirmNewPassword(req.body.newPassword, req.body.recoveryCode);
            if (!result.status){
                return resp
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .end();
            }
            return resp
                .status(HTTP_STATUS.NO_CONTENT)
                .end();
        } catch (error) {
            console.error("Error in AuthController confirmNewPassword:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }

    };

}