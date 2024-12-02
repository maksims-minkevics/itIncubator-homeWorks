import {validationParser} from "../midlewares/validations/validation-parser";
import {Request, Response, Router} from "express";
import {loginAuthorization} from "../midlewares/validations/authorization-validation1";
export const authRouter = Router({});
authRouter.post("/login",
    loginAuthorization,
    validationParser,
    async (req: Request, resp: Response) =>{
        resp
            .sendStatus(204)
    })