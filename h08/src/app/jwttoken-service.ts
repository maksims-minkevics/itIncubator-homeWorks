import {JwtTokenData, RefreshJwtTokenData, UpdatedRefreshJwtTokenData, UserDbModel} from "./index";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import {consts} from "./global-consts";
import {userHelper} from "../business-logic/user-business-logic";
import {settings} from "../settings";
dotenv.config()


if (!process.env.JWTTOKEN_SALT) {
    throw new Error("Environment variable JWTTOKEN_SALT is not defined");
}
export const jwttokenService = (() => {
    const jwtTokenSalt = process.env.JWTTOKEN_SALT || consts.DEFAULT_JWT_SALT;

    return {
        async generate(user: JwtTokenData): Promise<string> {
            const token = jwt.sign(user, jwtTokenSalt,{expiresIn: settings.AUTH_TOKEN_EXP_TIME});
            return token;
        },

        async verify(token: string): Promise<JwtTokenData | RefreshJwtTokenData | undefined> {
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

        async generateRtoken(token: string, user: JwtTokenData): Promise<string> {
            return jwt.sign(
                {"token": token, user: {userId: user.userId, userLogin: user.userLogin}},
                jwtTokenSalt,
                {expiresIn: settings.REFRESH_TOKEN_EXP_TIME}
            );
        },

        async generateNewRefreshToken(token: string, user: JwtTokenData):Promise<string | undefined>{
            const refreshToken = await this.generateRtoken(token, user);
            await userHelper.dbHandler.updateUserRefreshToken(refreshToken, user.userId);
            return refreshToken;
        },

        async updateRefreshToken(token: string, user: JwtTokenData): Promise<UpdatedRefreshJwtTokenData>{
            const newToken = await this.generate(user);
            const refreshToken = await this.generateRtoken(token, user);
            await userHelper.dbHandler.updateUserRefreshToken(refreshToken, user.userId);
            return {token: newToken, refreshToken: refreshToken}
        },

        async cancelRefreshToken(user: JwtTokenData):Promise<boolean>{
            return  await userHelper.dbHandler.updateUserRefreshToken("", user.userId);
        },

        async verifyRefreshToken(token: string):Promise<RefreshJwtTokenData | undefined>{
            try {
                return jwt.verify(token, jwtTokenSalt) as RefreshJwtTokenData;
            } catch (error) {
                return undefined;
            }
        },

    };
})();