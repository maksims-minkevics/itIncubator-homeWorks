import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import {userHelper} from "../../business-logic/user-business-logic";
import {checkSchema} from "express-validator";
import {validationParser} from "./validation-parser";
dotenv.config();

export const authValidation = checkSchema({
    loginOrEmail: {
        trim: true,
        isString: true,
    },
    password: {
        trim: true,
        isString: true
    }
})

export const loginAuthorization = [
    authValidation,
    validationParser,
    async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.body;
        if (!authHeader) {
            return res.sendStatus(401);
        }

        if (!authHeader.loginOrEmail || !authHeader.password) {
            return res.sendStatus(401);
        }

        const user = await userHelper.dbHandler.getUserByEmailLogin(authHeader.loginOrEmail, authHeader.loginOrEmail);
        if (!user) {
            return res.sendStatus(401);
        }
        const isAuthorized =
            (authHeader.loginOrEmail === user.login || authHeader.loginOrEmail === user.email)
            && await userHelper.compare(user.password, authHeader.password)
        if (!isAuthorized) {
            return res.sendStatus(401);
        }
        next();
        return isAuthorized;
    },
];