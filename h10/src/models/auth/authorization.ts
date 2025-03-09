import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import {HTTP_STATUS} from "../../general/global-consts";
import {
    jwtTokenServiceInstance, passwordServiceInstance,
    refreshTokenServiceInstance,
    userServiceInstance
} from "../../general/composition-root";
dotenv.config();


export const superAdminAuthorization = async (req: Request, resp: Response, next: NextFunction) =>{
    const authorizationBase64 = req.headers.authorization;
    if (!req.headers.authorization)
    {
        return resp
            .status(HTTP_STATUS.BAD_REQUEST)
            .end();
    }

    if (("Basic "+ btoa(process.env.SUPER_SECRET_NAME + ":" + process.env.SUPER_SECRET_PSWRD)) !== authorizationBase64){
        return resp
            .status(HTTP_STATUS.UNAUTHORIZED)
            .end();
    }
    next();
    return;
}
export const authorization1 = async (req: Request, resp: Response, next: NextFunction) =>{
    const authorizationBase64 = req.headers.authorization;
    if (("Basic "+ btoa(process.env.SUPER_SECRET_NAME + ":" + process.env.SUPER_SECRET_PSWRD)) !== authorizationBase64){
        return resp
            .status(HTTP_STATUS.UNAUTHORIZED)
            .end();
    }
    next();
    return ;
}

export const jwtTokenAuth = async (req: Request, resp: Response, next: NextFunction) => {
    if (!req.headers.authorization && !req.headers.authorization?.includes("Bearer"))
    {
        return resp
            .status(HTTP_STATUS.UNAUTHORIZED)
            .end();
    }
    const authorization = req.headers.authorization?.split(" ");

    if (!authorization)
    {
        return resp
            .status(HTTP_STATUS.UNAUTHORIZED)
            .end();
    }
    const user = await jwtTokenServiceInstance.verify(authorization[1]);
    if (!user.status){
        return resp
            .status(HTTP_STATUS.UNAUTHORIZED)
            .end();
    }

    if (!user.data){
        return resp
            .status(HTTP_STATUS.UNAUTHORIZED)
            .end();
    }
    req.user = {userId: user.data.userId, userLogin: user.data.userLogin}
    next();
    return;
}


export const jwtRefreshTokenAuth= async (req: Request, resp: Response, next: NextFunction) => {
    if (!req.cookies || !(req.cookies && Object.keys(req.cookies).includes("refreshToken")))
    {
        return resp
            .status(HTTP_STATUS.UNAUTHORIZED)
            .end();
    }
    const inputToken = req.cookies["refreshToken"];
    if(!inputToken){
        return resp
            .status(HTTP_STATUS.UNAUTHORIZED)
            .end();
    }
    const result = await refreshTokenServiceInstance.verify(inputToken);
    if (!result.status){
        return resp
            .status(HTTP_STATUS.UNAUTHORIZED)
            .end();
    }

    if (!result.data){
        return resp
            .status(HTTP_STATUS.UNAUTHORIZED)
            .end();
    }
    req.user = {userId: result.data.user.userId, userLogin: result.data.user.userLogin};
    req.refreshToken = inputToken;
    req.deviceId = result.data.deviceId;
    next();
    return ;
}

export const customBasicAuth =
    async (req: Request, resp: Response, next: NextFunction) => {
        const authHeader = req.body;
        if (!authHeader) {
            return resp
                .status(HTTP_STATUS.UNAUTHORIZED)
                .end();
        }

        if (!authHeader.password) {
            return resp
                .status(HTTP_STATUS.UNAUTHORIZED)
                .end();
        }

        if (!authHeader.loginOrEmail) {
            return resp
                .status(HTTP_STATUS.UNAUTHORIZED)
                .end();
        }

        const user = await userServiceInstance.findByEmailOrLoginDbModel(
            authHeader.loginOrEmail,
            authHeader.loginOrEmail
        );
        if (!user.status) {
            return resp
                .status(HTTP_STATUS.UNAUTHORIZED)
                .end();
        }

        if (!user.data) {
            return resp
                .status(HTTP_STATUS.UNAUTHORIZED)
                .end();
        }

        const isAuthorized =
            user && (authHeader.loginOrEmail === user.data.login || authHeader.loginOrEmail === user.data.email)
            && (await passwordServiceInstance.compare(user.data.password, authHeader.password)).status
        console.log(user.data.password)
        console.log(authHeader.password)
        console.log(isAuthorized)
        if (!isAuthorized) {
            return resp
                .status(HTTP_STATUS.UNAUTHORIZED)
                .end();
        }
        //TODO
        //MOVE TO SEPARATE METHOD
        req.user = {userId: user.data._id.toString(), userLogin: user.data.login}
        next();
        return;
    };