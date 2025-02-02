import {validationParser} from "../midlewares/validations/validation-parser";
import {Request, Response, Router} from "express";
import {customBasicAuth, jwtRefreshTokenAuth, jwtTokenAuth} from "../midlewares/validations/authorization";
import {
    authValidation,
    emailValidation,
    registrationValidation
} from "../midlewares/validations/authorization-data-validation";
import {jwttokenService} from "../app/jwttoken-service";
import {userHelper} from "../business-logic/user-business-logic";
import {mailService} from "../app/email-service";
import {registrationEmailTemplate} from "../app/email-templates";
import dotenv from "dotenv";
import {settings} from "../settings";
import {requestCounter} from "../midlewares/audit";
import {consts} from "../app/global-consts";
import jwt from "jsonwebtoken";

dotenv.config()


export const authRouter = Router({});
authRouter.post(
    consts.END_POINTS.AUTH.LOGIN,
    requestCounter,
    authValidation,
    validationParser,
    customBasicAuth,
    async (req: Request, resp: Response) => {
        const token = await jwttokenService.generate(req.user);
        const refreshToken = await jwttokenService.generateRtoken(req);
        resp.cookie("refreshToken", refreshToken, settings.REFRESH_TOKEN_PARAMETERS);
        console.log("URL", req.originalUrl)
        console.log("status code", 200)
        console.log("resp", {token: token, refreshToken: refreshToken})
        console.log("ip", req.ip)
        console.log("user-agent", req.headers['user-agent'])
        console.log("parsed token", jwt.decode(refreshToken))
        console.log("deviceId", req.deviceId)
        console.log("user", req.user)
        return resp
            .status(200)
            .json({
                accessToken: token
            })
    })
authRouter.get(
    consts.END_POINTS.AUTH.GET_DATA_ABOUT_CURRENT_ACTIVE_USER,
    jwtTokenAuth,
    async (req: Request, resp: Response) => {
        const user = await userHelper.dbHandler.getUserByEmailLogin(
            req.user.userLogin,
            req.user.userLogin
        )

        console.log("URL", req.originalUrl)
        console.log("status code", 200)
        console.log("deviceId", req.deviceId)
        console.log("user", req.user)
        return resp
            .status(200)
            .json({
                email: user?.email,
                login: user?.login,
                userId: user?.id
            })
    })

authRouter.post(
    consts.END_POINTS.AUTH.REG_CONFIRMATION,
    requestCounter,
    async (req: Request, resp: Response) => {
        const confirmationCode = req.body.code as string;
        if (!confirmationCode) {
            return resp
                .sendStatus(400);
        }
        const confirmationResult = await userHelper.confirmRegistration(confirmationCode);
        if (confirmationResult._isValidationFailed) {
            return resp
                .status(400)
                .json(confirmationResult.data);

        }
        return resp
            .sendStatus(204);
    })

authRouter.post(
    consts.END_POINTS.AUTH.REGISTRATION,
    requestCounter,
    registrationValidation,
    validationParser,
    async (req: Request, resp: Response) => {
        const confirmationData = await userHelper.newUserRegistration(req.body);
        if (confirmationData._isValidationFailed) {
            return resp
                .status(400)
                .json(confirmationData.data)
        }
        const template = registrationEmailTemplate(confirmationData.user!.confirmationCode);
        await mailService.sendEmail(req.body.email, template, "Test Email");
        return resp
            .sendStatus(204)
    })

authRouter.post(
    consts.END_POINTS.AUTH.RESEND_REG_CONF_EMAIL,
    requestCounter,
    emailValidation,
    validationParser,
    async (req: Request, resp: Response) => {
        const confirmationData = await userHelper.getUseForReConfirmation(req.body.email);
        if (confirmationData._isValidationFailed) {
            return resp
                .status(400)
                .json(confirmationData.data)
        }
        const template = registrationEmailTemplate(confirmationData.user!.confirmationCode);
        await mailService.sendEmail(req.body.email, registrationEmailTemplate(confirmationData.user!.confirmationCode), "Test Email");
        return resp
            .sendStatus(204);
    });

//TODO

authRouter.post(
    consts.END_POINTS.AUTH.REFRESH_TOKEN,
    jwtRefreshTokenAuth,
    async (req: Request, resp: Response) => {
        const token = await jwttokenService.generate(req.user)
        const refreshToken = await jwttokenService.generateRtoken(
            req
        );
        resp.cookie("refreshToken", refreshToken, settings.REFRESH_TOKEN_PARAMETERS);
        console.log("URL", req.originalUrl)
        console.log("status code", 200)
        console.log("resp", {token: token, refreshToken: refreshToken})
        console.log("ip", req.ip)
        console.log("user-agent", req.headers['user-agent'])
        console.log("parsed token", jwt.decode(refreshToken))
        console.log("deviceId", req.deviceId)
        console.log("user", req.user)
        return resp
            .status(200)
            .json({
                accessToken: token
            })

    });

authRouter.post(
    consts.END_POINTS.AUTH.LOGOUT,
    jwtRefreshTokenAuth,
    validationParser,
    async (req: Request, resp: Response) => {
        await jwttokenService.cancelRefreshToken(req.refreshToken);
        let refreshTokenData = undefined
        if (req.headers['cookie']){
            refreshTokenData = jwt.decode(
                req.headers['cookie'].split('=')[1].replace(';','')
            )
        }

        console.log("URL", req.originalUrl)
        console.log("status code", 204,)
        console.log("deviceId", req.deviceId)
        console.log("ip", req.ip)
        console.log("user-agent", req.headers['user-agent'])
        console.log("parsed token", req.refreshToken)
        console.log("user", req.user)
        resp.clearCookie("refreshToken");
        resp
            .sendStatus(204)
        return;


    });