import {Router} from "express";
import {userValidator} from "./middlewares/validations/userValidator";
import {validationParser} from "../../midlewares/validations/validation-parser";
import {getUserQueryExtander} from "../user/middlewares/extenders/extender";
import {authorization1} from "../../midlewares/validations/authorization";
import {consts} from "../../app/global-consts";
import {findByEmailOrLogin, createNew, deleteById} from "./controller";
export const userRouter = Router({});

userRouter.get(consts.END_POINTS.USER.GET,
    authorization1,
    getUserQueryExtander,
    findByEmailOrLogin
);

userRouter.post(consts.END_POINTS.USER.CREATE,
    authorization1,
    userValidator,
    validationParser,
    createNew
    );

userRouter.delete(consts.END_POINTS.USER.DELETE_BY_ID,
    authorization1,
    deleteById
)