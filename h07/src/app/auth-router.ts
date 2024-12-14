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
import {mailService} from "./email-service";
import {registrationEmailTemplate} from "./email-templates";
import dotenv from "dotenv";
import {getRegCode} from "../midlewares/extanders/req-query-extanders";
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
    const confirmationCode = req.body.code as string;

    if(!confirmationCode){
        return resp
            .sendStatus(400);
    }
    const confirmationResult = await userHelper.confirmRegistration(confirmationCode);
    if(confirmationResult._isValidationFailed){
        return resp
            .status(204)
            .json(confirmationResult.data);

    }
    return resp
        .sendStatus(204);
    })

authRouter.post("/registration",
    registrationValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
        const confirmationData = await userHelper.newUserRegistration(req.body);
        if(confirmationData._isValidationFailed){
            return resp
                .status(400)
                .json(confirmationData.data)
        }
        await mailService.sendEmail(req.body.email,registrationEmailTemplate(confirmationData.user!.confirmationCode), "Test Email");
        return resp
            .sendStatus(204)
    })

authRouter.post("/registration-email-resending",
    emailValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
        const confirmationData = await userHelper.getUseForReConfirmation(req.body.email);
        if (confirmationData._isValidationFailed){
            return resp
                .status(400)
                .json(confirmationData.data)
        }

        await mailService.sendEmail(req.body.email, registrationEmailTemplate(confirmationData.user!.confirmationCode), "Test Email");
        return resp
            .sendStatus(204);
});