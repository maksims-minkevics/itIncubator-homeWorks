import {Router} from "express";
import {jwtRefreshTokenAuth} from "../auth/authorization";
import {validationParser} from "../../midlewares/validation-parser";
import {checkSessionAccess} from "./middlewares";
import {SessionController} from "./controller";
import {SESSION_ENDPOINTS} from "./endpoints";
export const sessionRouter = Router();

sessionRouter.get(SESSION_ENDPOINTS.GET_ACTIVE_DEVICES,
    jwtRefreshTokenAuth,
    validationParser,
    SessionController.getActiveSessions
);

sessionRouter.delete(SESSION_ENDPOINTS.DELETE,
    jwtRefreshTokenAuth,
    validationParser,
    SessionController.deleteAllExceptCurrent
    );

sessionRouter.delete(SESSION_ENDPOINTS.DELETE_BY_ID(':deviceId'),
    jwtRefreshTokenAuth,
    checkSessionAccess,
    validationParser,
    SessionController.deleteById
    );