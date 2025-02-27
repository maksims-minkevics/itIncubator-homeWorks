import {JwtTokenData, ServiceResult} from "../../../general";
import {jwtTokenService} from "./jwtTokenService";
import {refreshTokenService} from "./refreshTokenService";
import {sessionService} from "../../session/services/sessionServices";
import {getFormattedDate} from "../../../general/utilities";
import { v4 as uuidv4 } from 'uuid';
import {LoginResponseData} from "../dataModels";

export const authService = {
    async login(
        ip: string,
        userAgent:string,
        user: JwtTokenData
    ): Promise<ServiceResult<LoginResponseData>>{
        const session = await sessionService.findOne({
            ip: ip,
            userId: user.userId,
            deviceName: userAgent
        });
        const issuedAt = await getFormattedDate();
        const newDeviceId = uuidv4();
        if (session.data){
            await sessionService.deleteById(session.data.deviceId, session.data.userId)
        }

        const refreshTokenData = await refreshTokenService.generate(
            user,
            newDeviceId,
            issuedAt
        );
        if(!refreshTokenData.status){
            return {data: null, status: false}
        }

        if(!refreshTokenData.data){
            return {data: null, status: false}
        }

        await sessionService.create(
            userAgent,
            ip,
            newDeviceId,
            user.userId,
            refreshTokenData.data.expireAt,
            issuedAt
        );

        const token = await jwtTokenService.generate(user);
        return {
            data:
                {
                accessToken: token,
                refreshToken: refreshTokenData.data.token
            },
            status: true
        }
    },
    async refreshToken(
        ip: string,
        deviceId: string,
        user: JwtTokenData
    ): Promise<ServiceResult<LoginResponseData>>{
        const session = await sessionService.findOne({
            ip: ip,
            deviceId: deviceId,
            userId: user.userId
        });
        const issuedAt = await getFormattedDate();
        let newDeviceId;
        if (session.status && session.data){
            newDeviceId = session.data.deviceId;
        }
        else {
            newDeviceId = uuidv4();
        }

        const refreshTokenData = await refreshTokenService.generate(
            user,
            newDeviceId,
            issuedAt
        );
        if(!refreshTokenData.status){
            return {data: null, status: false}
        }

        if(!refreshTokenData.data){
            return {data: null, status: false}
        }

        await sessionService.updateSession(newDeviceId, refreshTokenData.data.expireAt, issuedAt);

        const token = await jwtTokenService.generate(user);
        return {
            data:
                {
                    accessToken: token,
                    refreshToken: refreshTokenData.data.token
                },
            status: true
        }
    },
    async logOut(deviceId: string, userId: string): Promise<ServiceResult<LoginResponseData>>{
        if(!deviceId){
            return {data: null, status: false}
        }
        const isDeviceActive = await sessionService.deleteById(deviceId, userId);
        if (!isDeviceActive.status){
            return {data: null, status: false}
        }

        return {data: null, status: true}


    }
}