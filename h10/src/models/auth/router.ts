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
import {AUTH_ENDPOINTS} from "./endpoints";
import {ioc} from "../../general/composition-root";
import {AuthController} from "./controller";
dotenv.config()

const authorizationControllerInstance = ioc.getInstance<AuthController>(AuthController);
export const authRouter = Router();
authRouter.post(
    AUTH_ENDPOINTS.LOGIN,
    requestCounter,
    authValidation,
    validationParser,
    customBasicAuth,
    authorizationControllerInstance.login.bind(authorizationControllerInstance)
);

authRouter.get(
    AUTH_ENDPOINTS.GET_DATA_ABOUT_CURRENT_ACTIVE_USER,
    jwtTokenAuth,
    authorizationControllerInstance.getActiveUser.bind(authorizationControllerInstance)
);

authRouter.post(
    AUTH_ENDPOINTS.REG_CONFIRMATION,
    requestCounter,
    authorizationControllerInstance.confirmRegistration.bind(authorizationControllerInstance)
);

authRouter.post(
    AUTH_ENDPOINTS.REGISTRATION,
    requestCounter,
    registrationValidation,
    validationParser,
    authorizationControllerInstance.registration.bind(authorizationControllerInstance)
);

authRouter.post(
    AUTH_ENDPOINTS.RESEND_REG_CONF_EMAIL,
    requestCounter,
    emailValidation,
    validationParser,
    authorizationControllerInstance.resendConfirmEmail.bind(authorizationControllerInstance)
);

authRouter.post(
    AUTH_ENDPOINTS.LOGOUT,
    jwtRefreshTokenAuth,
    validationParser,
    authorizationControllerInstance.logOut.bind(authorizationControllerInstance)
);

authRouter.post(
    AUTH_ENDPOINTS.REFRESH_TOKEN,
    jwtRefreshTokenAuth,
    authorizationControllerInstance.refreshToken.bind(authorizationControllerInstance)
);

authRouter.post(
    AUTH_ENDPOINTS.RECOVER_PASSWORD,
    jwtRefreshTokenAuth,
    authorizationControllerInstance.recoveryPassword.bind(authorizationControllerInstance)
);

authRouter.post(
    AUTH_ENDPOINTS.CONFIRM_NEW_PASSWORD,
    jwtRefreshTokenAuth,
    authorizationControllerInstance.confirmNewPassword.bind(authorizationControllerInstance)
);
