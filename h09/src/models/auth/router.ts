import {validationParser} from "../../midlewares/validation-parser";
import {Router} from "express";
import {customBasicAuth, jwtRefreshTokenAuth, jwtTokenAuth} from "./authorization";
import {
    authValidation,
    emailValidation,
    registrationValidation
} from "./middlewares/validations/authDataValidation";
import dotenv from "dotenv";
import {requestCounter} from "../../midlewares/audit";
import {AuthController} from "./controller";
import {AUTH_ENDPOINTS} from "./endpoints";
dotenv.config()


export const authRouter = Router();
authRouter.post(
    AUTH_ENDPOINTS.LOGIN,
    requestCounter,
    authValidation,
    validationParser,
    customBasicAuth,
    AuthController.login);

authRouter.get(
    AUTH_ENDPOINTS.GET_DATA_ABOUT_CURRENT_ACTIVE_USER,
    jwtTokenAuth,
    AuthController.getActiveUser);

authRouter.post(
    AUTH_ENDPOINTS.REG_CONFIRMATION,
    requestCounter,
    AuthController.confirmRegistration);

authRouter.post(
    AUTH_ENDPOINTS.REGISTRATION,
    requestCounter,
    registrationValidation,
    validationParser,
    AuthController.registration);

authRouter.post(
    AUTH_ENDPOINTS.RESEND_REG_CONF_EMAIL,
    requestCounter,
    emailValidation,
    validationParser,
    AuthController.resendConfirmEmail);

authRouter.post(
    AUTH_ENDPOINTS.REFRESH_TOKEN,
    jwtRefreshTokenAuth,
    AuthController.refreshToken);

authRouter.post(
    AUTH_ENDPOINTS.LOGOUT,
    jwtRefreshTokenAuth,
    validationParser,
    AuthController.logOut);