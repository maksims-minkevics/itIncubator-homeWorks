import {validationParser} from "../midlewares/validations/validation-parser";
import {Request, Response, Router} from "express";
import {basicAuth, jwtRefreshTokenAuth, jwtTokenAuth} from "../midlewares/validations/authorization";
import {
    authValidation,
    emailValidation,
    registrationValidation
} from "../midlewares/validations/authorization-data-validation";
import {jwttokenService} from "../app/jwttoken-service";
import {userHelper} from "../business-logic/user-business-logic";
import {mailService} from "../app/email-service";
import {registrationEmailTemplate} from "../app/email-templates";
import dotenv from "dotenv";
import {settings} from "../settings";
import {requestCounter} from "../midlewares/audit";
dotenv.config()


export const authRouter = Router({});
authRouter.post("/login",
    requestCounter,
    authValidation,
    validationParser,
    basicAuth,
    async (req: Request, resp: Response) =>{
        const token = await jwttokenService.generate(req.user);
        const refreshToken = await jwttokenService.generateRtoken(req);
        resp.cookie("refreshToken", refreshToken, settings.REFRESH_TOKEN_PARAMETERS);
        return resp
            .status(200)
            .json({
                accessToken: token
            })
    })
authRouter.get("/me",
    jwtTokenAuth,
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

authRouter.post("/registration-confirmation",requestCounter,
    async (req: Request, resp: Response) =>{
    const confirmationCode = req.body.code as string;
    if(!confirmationCode){
        return resp
            .sendStatus(400);
    }
    const confirmationResult = await userHelper.confirmRegistration(confirmationCode);
    if(confirmationResult._isValidationFailed){
        return resp
            .status(400)
            .json(confirmationResult.data);

    }
    return resp
        .sendStatus(204);
    })

authRouter.post("/registration",
    requestCounter,
    registrationValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
        const confirmationData = await userHelper.newUserRegistration(req.body);
        if(confirmationData._isValidationFailed){
            return resp
                .status(400)
                .json(confirmationData.data)
        }
        const template = registrationEmailTemplate(confirmationData.user!.confirmationCode);
        await mailService.sendEmail(req.body.email, template, "Test Email");
        return resp
            .sendStatus(204)
    })

authRouter.post("/registration-email-resending",
    requestCounter,
    emailValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
        const confirmationData = await userHelper.getUseForReConfirmation(req.body.email);
        if (confirmationData._isValidationFailed){
            return resp
                .status(400)
                .json(confirmationData.data)
        }
        const template = registrationEmailTemplate(confirmationData.user!.confirmationCode);
        await mailService.sendEmail(req.body.email, registrationEmailTemplate(confirmationData.user!.confirmationCode), "Test Email");
        return resp
            .sendStatus(204);
});

//TODO

authRouter.post("/refresh-token",
    jwtRefreshTokenAuth,
    validationParser,
    async (req: Request, resp: Response) =>{
    const result = await jwttokenService.generateRtoken(
        req
    );
    resp.cookie("refreshToken", result, settings.REFRESH_TOKEN_PARAMETERS);
    return resp
        .status(200)
        .json({
            accessToken: result
        })

    });

authRouter.post("/logout",
    jwtRefreshTokenAuth,
    validationParser,
    async (req: Request, resp: Response) =>{
        await jwttokenService.cancelRefreshToken(req.refreshToken);
        resp
            .sendStatus(204)
        return;


    });