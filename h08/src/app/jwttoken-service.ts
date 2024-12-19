import {JwtTokenData, UserDbModel} from "./index";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import {consts} from "./global-consts";
dotenv.config()

if (!process.env.JWTTOKEN_SALT) {
    throw new Error("Environment variable JWTTOKEN_SALT is not defined");
}
export const jwttokenService = (() => {
    const jwtTokenSalt = process.env.JWTTOKEN_SALT || consts.DEFAULT_JWT_SALT;

    return {
        async generate(user: JwtTokenData): Promise<string> {
            const token = jwt.sign(user, jwtTokenSalt);
            return token;
        },

        async verify(token: string): Promise<JwtTokenData | undefined> {
            try {
                return jwt.verify(token, jwtTokenSalt) as JwtTokenData;
            } catch (error) {
                return undefined;
            }
        },

        async decode(token: string): Promise<JwtTokenData> {
            const decoded = jwt.verify(token, jwtTokenSalt);
            return decoded as JwtTokenData;
        },
    };
})();