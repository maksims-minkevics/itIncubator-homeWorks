import {Router} from "express";
import {jwtRefreshTokenAuth} from "../../midlewares/validations/authorization";
import {validationParser} from "../../midlewares/validations/validation-parser";
import {checkSessionAccess} from "./middlewares";
import {deleteAllExceptCurrent, deleteById, getActiveSessions} from "./controller";
import {SESSION_ENDPOINTS} from "./endpoints";
export const sessionRouter = Router();

sessionRouter.get(SESSION_ENDPOINTS.GET_ACTIVE_DEVICES,
    jwtRefreshTokenAuth,
    validationParser,
    getActiveSessions
);

sessionRouter.delete(SESSION_ENDPOINTS.DELETE,
    jwtRefreshTokenAuth,
    validationParser,
    deleteAllExceptCurrent
    );

sessionRouter.delete(SESSION_ENDPOINTS.DELETE_BY_ID(':deviceId'),
    jwtRefreshTokenAuth,
    checkSessionAccess,
    validationParser,
    deleteById
    );