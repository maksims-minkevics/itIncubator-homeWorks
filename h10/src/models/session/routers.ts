import {Router} from "express";
import {jwtRefreshTokenAuth} from "../auth/authorization";
import {validationParser} from "../../midlewares/validation-parser";
import {checkSessionAccess} from "./middlewares";
import {SESSION_ENDPOINTS} from "./endpoints";
import {ioc} from "../../general/composition-root";
import {SessionController} from "./controller";
export const sessionRouter = Router();
const sessionControllerInstance = ioc.getInstance(SessionController);
sessionRouter.get(SESSION_ENDPOINTS.GET_ACTIVE_DEVICES,
    jwtRefreshTokenAuth,
    validationParser,
    sessionControllerInstance.getActiveSessions.bind(sessionControllerInstance)
);

sessionRouter.delete(SESSION_ENDPOINTS.DELETE,
    jwtRefreshTokenAuth,
    validationParser,
    sessionControllerInstance.deleteAllExceptCurrent.bind(sessionControllerInstance)
    );

sessionRouter.delete(SESSION_ENDPOINTS.DELETE_BY_ID(':deviceId'),
    jwtRefreshTokenAuth,
    checkSessionAccess,
    validationParser,
    sessionControllerInstance.deleteById.bind(sessionControllerInstance)
    );