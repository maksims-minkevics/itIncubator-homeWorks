import {
    JwtTokenData,
    RefreshJwtTokenData,
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
            return jwt.sign(
                user,
                jwtTokenSalt,
                {expiresIn: settings.AUTH_TOKEN_EXP_TIME});
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
        async generateRefreshJwtToken(user: JwtTokenData, deviceId: string, issuedAt: string, req: Request){
            const expireAt = await getFormattedDate({
                seconds: settings.REFRESH_TOKEN_EXP_TIME
            });
            const newToken = jwt.sign(
                {
                    user: {
                        userId: user.userId,
                        userLogin: user.userLogin
                    },
                    deviceId: deviceId,
                    expireAt: expireAt,
                    issuedAt: issuedAt,
                    agent: req.headers['user-agent'] || "",
                    ip: req.ip || ""
                },
                rJwtTokenSalt,
                {
                    expiresIn: settings.REFRESH_TOKEN_EXP_TIME
                }
            )
            return {expireAt: expireAt, token: newToken}
        },

        async updateSession (req: Request, deviceId: string, token: {token: string, expireAt: string}, issuedAt: string){
            await  rTokenDbHandler.updateSession(
                deviceId,
                {
                    issuedAt: issuedAt,
                    expireAt: token.expireAt,
                    lastActiveDate: issuedAt
                }

            );

        },

        async createNewSession (req: Request, deviceId: string, token: {token: string, expireAt: string}, issuedAt: string){
            const userAgent = req.headers["user-agent"];
            const userIp = req.ip || "";
            await rTokenDbHandler.create(
                {
                    deviceId: deviceId,
                    userId: req.user.userId,
                    deviceName: userAgent,
                    ip: userIp,
                    lastActiveDate: issuedAt,
                    issuedAt: issuedAt,
                    expireAt: token.expireAt
                }

            );
        },

        async generateRtoken(
            req: Request,
        ): Promise<string> {

            const getFields: Record<string, any> = {};
            if (req.ip) getFields.ip = req.ip;
            if (req.deviceId) getFields.deviceId = req.deviceId;
            if (req.headers["user-agent"]) getFields.deviceName = req.headers["user-agent"];
            getFields.userId = req.user.userId;

            const isDeviceAdded = await rTokenDbHandler.getOne(
                getFields
            )

            const issuedAt = await getFormattedDate();
            if (isDeviceAdded){
                const newTokenData = await this.generateRefreshJwtToken(
                    req.user,
                    isDeviceAdded.deviceId,
                    issuedAt,
                    req
                );
                const deviceId = isDeviceAdded.deviceId;
                await this.updateSession(
                    req,
                    deviceId,
                    newTokenData,
                    issuedAt
                );
                return newTokenData.token
            }
            else{
                const deviceId = uuidv4();
                const newTokenData = await this.generateRefreshJwtToken(
                    req.user,
                    deviceId,
                    issuedAt,
                    req
                );
                await this.createNewSession(
                    req,
                    deviceId,
                    newTokenData,
                    issuedAt
                );
                return newTokenData.token

            }
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
                if (tokenMetaData.issuedAt !== tokenData.issuedAt) {
                    throw new Error("Token metadata mismatch");
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