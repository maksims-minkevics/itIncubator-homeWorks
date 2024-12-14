import {validationParser} from "../midlewares/validations/validation-parser";
import {Request, Response, Router} from "express";
import {basicAuthorization, jwtTokenAuthorization} from "../midlewares/validations/authorization";
import {
    authValidation,
    emailValidation,
    registrationValidation
} from "../midlewares/validations/authorization-data-validation";
import {jwttokenService} from "./jwttoken-service";
import {userHelper} from "../business-logic/user-business-logic";
import nodemailer from "nodemailer";
import {mailService} from "./email-service";
import {registrationEmailTemplate} from "./email-templates";
import {consts} from "./global-consts";
import dotenv from "dotenv";
import {getRegCode} from "../midlewares/extanders/req-query-extanders";
import {emailResendingDataInputModel} from "./index";
dotenv.config()
export const authRouter = Router({});
authRouter.post("/login",
    authValidation,
    validationParser,
    basicAuthorization,
    async (req: Request, resp: Response) =>{
        const token = await jwttokenService.generate(req.user);
        return resp
            .status(200)
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
        return resp
            .status(200)
            .json({
                email: user?.email,
                login: user?.login,
                userId: user?.id
            })
    })

authRouter.post("/registration-confirmation",
    getRegCode,
    async (req: Request, resp: Response) =>{
    const confirmationCode = req.query.code as string;

    if(!confirmationCode){
        return resp
            .sendStatus(400);
    }
    const isActivated = await userHelper.confirmRegistration(confirmationCode);

    if (!isActivated){
        return resp
            .sendStatus(400);
    }

    return resp
        .sendStatus(204);
    })

authRouter.post("/registration",
    registrationValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
        console.log("here1")
        const result = await userHelper.newUserRegistration(req.body);
        if('errorsMessages' in result){
            return resp
                .status(400)
                .json(result)
        }
        const createdUser = await userHelper.dbHandler.getUserByField("email", req.body.email);
        console.log(createdUser);
        await mailService.sendEmail(req.body.email,registrationEmailTemplate(createdUser!.confirmationCode), "Test Email");
        return resp
            .sendStatus(204)
    })

authRouter.post("/registration-email-resending",
    emailValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
        const resendingData: emailResendingDataInputModel = req.body;
        if (!resendingData?.email){
            return resp.
                sendStatus(400);
        }
        const user = await userHelper.dbHandler.getUserByField("email", resendingData.email);
        if (!user){
            return resp.
                sendStatus(400);
        }
        await mailService.sendEmail(req.body.email, registrationEmailTemplate(user.confirmationCode), "Test Email");
        return resp
            .sendStatus(204);
});