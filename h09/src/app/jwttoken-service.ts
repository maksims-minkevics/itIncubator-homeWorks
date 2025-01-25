import {
    GeneratedRefreshJwtTokenData,
    JwtTokenData,
    RefreshJwtTokenData,
    RefreshTokenMetaDataDbModel,
    UpdatedRefreshJwtTokenData
} from "./index";
import {Request} from "express";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import {consts} from "./global-consts";
import {settings} from "../settings";
import {getFormattedDate, parseFormattedDate} from "./utilities";
import { v4 as uuidv4 } from 'uuid';
import {RefreshTokenMetaDataDbHandler} from "../db-handlers/refresh-token-meta-data-db-handler";
dotenv.config()


if (!process.env.JWTTOKEN_SALT) {
    throw new Error("Environment variable JWTTOKEN_SALT is not defined");
}
export const jwttokenService = (() => {
    const jwtTokenSalt = process.env.JWTTOKEN_SALT || consts.DEFAULT_JWT_SALT;
    const rJwtTokenSalt = process.env.REFRESH_JWTTOKEN_SALT || consts.DEFAULT_JWT_SALT;
    const rTokenDbHandler = new RefreshTokenMetaDataDbHandler();

    return {
        async generate(user: JwtTokenData): Promise<string> {
            const token = jwt.sign(
                user,
                jwtTokenSalt,
                {expiresIn: settings.AUTH_TOKEN_EXP_TIME});
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

        async generateRtoken(user: JwtTokenData, req: Request, eDeviceId: string = ""): Promise<GeneratedRefreshJwtTokenData> {

            const issuedAt = await getFormattedDate();
            const expireAt = await getFormattedDate({seconds:settings.REFRESH_TOKEN_EXP_TIME});
            const userAgent = req.headers["user-agent"];
            const userIp = req.ip;
            const deviceId = eDeviceId || uuidv4();
            const isDeviceAdded = await rTokenDbHandler.get({userId: req.user.userId, ip: userIp, deviceName: userAgent})
            const tokenData: RefreshTokenMetaDataDbModel = {
                issuedAt: issuedAt,
                deviceId: deviceId,
                deviceName: userAgent || "",
                expireAt: expireAt,
                ip: userIp || "",
                userId: user.userId,
                lastActiveDate: issuedAt
            }
            if (!(isDeviceAdded?.length || eDeviceId)){
                await rTokenDbHandler.create(tokenData);
            }
            else{
                await rTokenDbHandler.updateSession(deviceId, {expireAt:expireAt, lastActiveDate: issuedAt})
            }

            const newToken = jwt.sign(
                {user: {userId: user.userId, userLogin: user.userLogin}, deviceId: deviceId, expireAt: expireAt},
                rJwtTokenSalt,
                {expiresIn: settings.REFRESH_TOKEN_EXP_TIME}
            );
            return {token: newToken, data: tokenData}
        },

        async generateNewRefreshToken(user: JwtTokenData, req: Request):Promise<string | undefined>{
            const newToken = await this.generateRtoken(user, req);
            await rTokenDbHandler.updateSession(newToken.data.deviceId, {
                issuedAt: newToken.data.issuedAt,
                expireAt: newToken.data.expireAt,
                lastActiveDate: newToken.data.lastActiveDate
            });
            return newToken.token;
        },
        async updateRefreshToken(user: JwtTokenData, req: Request): Promise<UpdatedRefreshJwtTokenData>{
            const newToken = await this.generate(user);
            const refreshToken = await this.generateRtoken(
                user,
                req,
                req.deviceId
            );
            await rTokenDbHandler.updateSession(refreshToken.data.deviceId, {
                issuedAt: refreshToken.data.issuedAt,
                expireAt: refreshToken.data.expireAt,
                lastActiveDate: refreshToken.data.lastActiveDate
            });
            return {token: newToken, refreshToken: refreshToken.token}
        },

        async cancelRefreshToken(token: string):Promise<boolean>{
            const rTokenData = await this.verifyRefreshToken(token)
            if(!rTokenData){
                return false
            }

            return await rTokenDbHandler.updateSession(rTokenData.deviceId, {expireAt: await getFormattedDate()});
        },

        async verifyRefreshToken(token: string): Promise<RefreshJwtTokenData | undefined> {
            try {
                const tokenData = jwt.verify(token, rJwtTokenSalt) as RefreshJwtTokenData;
                const tokenMetaData = await rTokenDbHandler.getActiveSession(tokenData.deviceId);

                if (!tokenMetaData) {
                    throw new Error("Invalid Device Id");
                }

                const expireDate = await parseFormattedDate(tokenData.expireAt);

                if (expireDate.getTime() < new Date().getTime()) {
                    throw new Error("Token has expired");
                }

                if (tokenMetaData.expireAt !== tokenData.expireAt) {
                    throw new Error("Token metadata mismatch");
                }

                return tokenData;
            } catch (error) {
                return undefined;
            }
        },

    };
})();