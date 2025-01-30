import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import {userHelper} from "../../business-logic/user-business-logic";
import {jwttokenService} from "../../app/jwttoken-service";
import {JwtTokenData, RefreshJwtTokenData} from "../../app/index";
dotenv.config();


export const superAdminAuthorization = async (req: Request, resp: Response, next: NextFunction) =>{
    const authorizationBase64 = req.headers.authorization;
    if (!req.headers.authorization)
    {
        resp
            .sendStatus(400)
        return;
    }

    if (("Basic "+ btoa(process.env.SUPER_SECRET_NAME + ":" + process.env.SUPER_SECRET_PSWRD)) !== authorizationBase64){
        resp
            .sendStatus(401)
        return;
    }
    next();
}
export const authorization1 = async (req: Request, resp: Response, next: NextFunction) =>{
    const authorizationBase64 = req.headers.authorization;
    if (("Basic "+ btoa(process.env.SUPER_SECRET_NAME + ":" + process.env.SUPER_SECRET_PSWRD)) !== authorizationBase64){
        resp
            .sendStatus(401)
        return;
    }
    next();
}

export const jwtTokenAuth = async (req: Request, resp: Response, next: NextFunction) => {
    if (!req.headers.authorization && !req.headers.authorization?.includes("Bearer"))
    {
        resp
            .sendStatus(401)
        return;
    }
    const authorization = req.headers.authorization?.split(" ")

    if (!authorization)
    {
        resp
            .sendStatus(401)
        return;
    }
    const user = await jwttokenService.verify(authorization[1]) as JwtTokenData;
    console.log(user)
    if (!user){
        console.log('failed here')
        resp
            .sendStatus(401)
        return;
    }
    req.user = {userId: user!.userId, userLogin: user!.userLogin}
    next();
}


export const jwtRefreshTokenAuth= async (req: Request, resp: Response, next: NextFunction) => {
    if (!req.cookies || !(req.cookies && Object.keys(req.cookies).includes("refreshToken")))
    {
        resp
            .sendStatus(401);
        return;
    }

    const inputToken = req.cookies["refreshToken"];
    if(!inputToken){
        resp
            .sendStatus(401);
        return;
    }
    const token = await jwttokenService.verifyRefreshToken(inputToken) as RefreshJwtTokenData;
    if (!token){
        resp
            .sendStatus(401);
        return;
    }
    req.user = {userId: token.user!.userId, userLogin: token.user!.userLogin};
    req.refreshToken = inputToken;
    req.deviceId = token.deviceId;
    next();
}

export const basicAuth =
    async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.body;
        if (!authHeader) {
            res.sendStatus(401);
            return;
        }

        if (!authHeader.loginOrEmail || !authHeader.password) {
            res.sendStatus(401);
            return;
        }

        const user = await userHelper.dbHandler.getUserByEmailLogin(
            authHeader.loginOrEmail,
            authHeader.loginOrEmail
        );
        if (!user) {
            res.sendStatus(401);
            return;
        }

        const isAuthorized =
            user && (authHeader.loginOrEmail === user.login || authHeader.loginOrEmail === user.email)
            && await userHelper.compare(user.password, authHeader.password)

        if (!isAuthorized) {
            res.sendStatus(401);
            return;
        }
        //TODO
        //MOVE TO SEPARATE METHOD
        req.user = {userId: user.id, userLogin: user.login}
        next();
    };