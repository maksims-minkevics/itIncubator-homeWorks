import {Router} from "express";
import {userValidator} from "./middlewares/validations/userValidator";
import {validationParser} from "../../midlewares/validation-parser";
import {getUserQueryExtander} from "../user/middlewares/extenders/extender";
import {authorization1} from "../auth/authorization";
import {UserController} from "./controller";
import {USER_ENDPOINTS} from "./endpoints";
import {objectIdValidator} from "../../globals/middleware/validators/mongoDbIdValidator";
export const userRouter = Router();

userRouter.get(USER_ENDPOINTS.GET_ALL,
    authorization1,
    getUserQueryExtander,
    UserController.findByEmailOrLogin
);

userRouter.post(USER_ENDPOINTS.CREATE,
    authorization1,
    userValidator,
    validationParser,
    UserController.createNew
    );

userRouter.delete(USER_ENDPOINTS.DELETE_BY_ID(":id"),
    authorization1,
    objectIdValidator,
    UserController.deleteById
)