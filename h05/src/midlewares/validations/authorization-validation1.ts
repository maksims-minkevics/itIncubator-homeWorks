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

export const authorization = [
    ...authValidation,
    validationParser,
    async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Basic ")) {
            return res.sendStatus(401);
        }


        const authBase64String = Buffer.from(authHeader.split(" ")[1], "base64").toString();
        const [login, password] = authBase64String.split(":");

        if (!login || !password) {
            return res.sendStatus(401);
        }

        const user = await userHelper.dbHandler.getUserByEmailLogin(login, login);
        if (!user) {
            return res.sendStatus(401);
        }
        const isAuthorized =
            (login === user.login || login === user.email) && await userHelper.compare(user.password, password)
        if (!isAuthorized) {
            return res.sendStatus(401);
        }
        next();
        return isAuthorized;
    },
];