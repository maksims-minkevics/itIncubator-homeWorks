import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../../../general/global-consts";
import {jwtTokenServiceInstance} from "../../../general/composition-root";

export const getUserFromJwtToken = async (req: Request, resp: Response, next: NextFunction) => {
    if (!req.headers.authorization && !req.headers.authorization?.includes("Bearer"))
    {
        req.user = {userId: "", userLogin: ""}
        return next();
    }
    const authorization = req.headers.authorization?.split(" ");

    if (!authorization)
    {
        return next();
    }
    const user = await jwtTokenServiceInstance.verify(authorization[1]);
    if (!user.status){
        req.user = {userId: "", userLogin: ""}
        return next();
    }

    if (!user.data){
        req.user = {userId: "", userLogin: ""}
        return next();
    }
    req.user = {userId: user.data.userId, userLogin: user.data.userLogin}
    next();
    return;
}