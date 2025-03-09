import {JwtTokenData, ServiceResult} from "../../../general";
import {RefreshJwtTokenData, RefreshTokenData} from "../dataModels";
import {getFormattedDate, parseFormattedDate} from "../../../general/utilities";
import {settings} from "../../../settings";
import jwt from "jsonwebtoken";
import {SessionService} from "../../session/services/sessionServices";
import {consts} from "../../../general/global-consts";


if (!process.env.REFRESH_JWTTOKEN_SALT) {
    throw new Error("Environment variable JWTTOKEN_SALT is not defined");
}
const rJwtTokenSalt = process.env.REFRESH_JWTTOKEN_SALT || consts.DEFAULT_JWT_SALT;
export class RefreshTokenService{
    constructor(protected sessionService: SessionService) {
    }
    async generate(
        user: JwtTokenData,
        deviceId: string,
        issuedAt: string
    ): Promise<ServiceResult<RefreshTokenData>>{
        try {
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
                },
                rJwtTokenSalt,
                {
                    expiresIn: settings.REFRESH_TOKEN_EXP_TIME
                }
            );
            return {data: {expireAt: expireAt, token: newToken}, status: true}
        }
        catch (error){
            return {data: null, status: false}
        }
    };

    async cancel(token: string, user: JwtTokenData):Promise<ServiceResult<RefreshTokenData>>{
        const rTokenData = await this.verify(token)
        if(!rTokenData.status){
            return {data: null, status: false}
        }
        const data = rTokenData.data as RefreshJwtTokenData;
        const isDeleted = await this.sessionService.deleteById(
            data.deviceId,
            user.userId
            );

        if(!isDeleted.status){
            return {data: null, status: false}
        }


        return {data: null, status: true}

    };

    async verify(token: string): Promise<ServiceResult<RefreshJwtTokenData>> {
        try {
            const tokenData = jwt.verify(token, rJwtTokenSalt) as RefreshJwtTokenData;
            const tokenMetaData = await this.sessionService
                .findOne({deviceId: tokenData.deviceId});
            if (!tokenMetaData.data) {
                throw new Error("Invalid Device Id");
            }

            const expireDate = await parseFormattedDate(tokenData.expireAt);

            if (expireDate.getTime() < new Date().getTime()) {
                console.log("Token has expired")
                throw new Error("Token has expired");
            }
            if (tokenMetaData.data.issuedAt !== tokenData.issuedAt) {
                console.log("Token metadata mismatch")
                throw new Error("Token metadata mismatch");
            }

            if (tokenMetaData.data.expireAt !== tokenData.expireAt) {
                console.log("Token metadata mismatch")
                throw new Error("Token metadata mismatch");
            }

            return {data: tokenData, status: true};
        } catch (error) {
            return {data: null, status: false};
        }
    };
}