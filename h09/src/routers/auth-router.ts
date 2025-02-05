import {validationParser} from "../midlewares/validations/validation-parser";
import {Request, Response, Router} from "express";
import {customBasicAuth, jwtRefreshTokenAuth, jwtTokenAuth} from "../midlewares/validations/authorization";
import {
    authValidation,
    emailValidation,
    registrationValidation
} from "../midlewares/validations/authorization-data-validation";
import {jwttokenService} from "../app/jwttoken-service";
import {userHelper} from "../models/user/user-business-logic";
import {emailService} from "../app/email-service";
import {registrationEmailTemplate} from "../app/email-templates";
import dotenv from "dotenv";
import {settings} from "../settings";
import {requestCounter} from "../midlewares/audit";
import {consts} from "../app/global-consts";

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
        const user = await userHelper.dbHandler.findByEmailOrLogin(
            req.user.userLogin,
            req.user.userLogin
        )
        return resp
            .status(200)
            .json({
                email: user?.email,
                login: user?.login,
                userId: user?._id
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
        await emailService.sendEmail(req.body.email, template, "Test Email");
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
        await emailService.sendEmail(req.body.email, registrationEmailTemplate(confirmationData.user!.confirmationCode), "Test Email");
        return resp
            .sendStatus(204);
    });

authRouter.post(
    consts.END_POINTS.AUTH.REFRESH_TOKEN,
    jwtRefreshTokenAuth,
    async (req: Request, resp: Response) => {
        const token = await jwttokenService.generate(req.user)
        const result = await jwttokenService.generateRtoken(
            req
        );
<<<<<<< Updated upstream
        resp.cookie("refreshToken", result, settings.REFRESH_TOKEN_PARAMETERS);
=======
        resp.cookie("refreshToken", refreshToken, settings.REFRESH_TOKEN_PARAMETERS);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
        resp.clearCookie("refreshToken");
        resp
            .sendStatus(204)
        return;


    });