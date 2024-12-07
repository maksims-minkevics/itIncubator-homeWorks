import {validationParser} from "../midlewares/validations/validation-parser";
import {Request, Response, Router} from "express";
import {basicAuthorization, jwtTokenAuthorization} from "../midlewares/validations/authorization";
import {authValidation} from "../midlewares/validations/authorization-data-validation";
import {jwttokenService} from "./jwttoken-service";
import {userHelper} from "../business-logic/user-business-logic";

export const authRouter = Router({});
authRouter.post("/login",
    authValidation,
    validationParser,
    basicAuthorization,
    async (req: Request, resp: Response) =>{
        const token = await jwttokenService.generate(req.user);
        console.log(token)
        resp.status(200)
            .json({
                accessToken: token
            })
    })
authRouter.get("/me",
    jwtTokenAuthorization,
    async (req: Request, resp: Response) =>{
        const user = await userHelper.dbHandler.getUserByEmailLogin(
            req.user.userLogin,
            req.user.userLogin
        )
        resp
            .status(200)
            .json({
                email: user?.email,
                login: user?.login,
                userId: user?.id
            })
    })