import {Router} from "express";
import {userValidator} from "./middlewares/validations/userValidator";
import {validationParser} from "../../midlewares/validation-parser";
import {getUserQueryExtander} from "../user/middlewares/extenders/extender";
import {authorization1} from "../auth/authorization";
import {USER_ENDPOINTS} from "./endpoints";
import {objectIdValidator} from "../../globals/middleware/validators/mongoDbIdValidator";
import {ioc} from "../../general/composition-root";
import {UserController} from "./controller";
export const userRouter = Router();
const userControllerInstance = ioc.getInstance(UserController);
userRouter.get(
    USER_ENDPOINTS.GET_ALL,
    authorization1,
    getUserQueryExtander,
    userControllerInstance.findByEmailOrLogin.bind(userControllerInstance)
);

userRouter.post(
    USER_ENDPOINTS.CREATE,
    authorization1,
    userValidator,
    validationParser,
    userControllerInstance.createNew.bind(userControllerInstance)
    );

userRouter.delete(
    USER_ENDPOINTS.DELETE_BY_ID(":id"),
    authorization1,
    objectIdValidator,
    userControllerInstance.deleteById.bind(userControllerInstance)
)