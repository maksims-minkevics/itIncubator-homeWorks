import {DefaultResult, JwtTokenData, ServiceResult} from "../../../general";
import {JwtTokenService} from "./jwtTokenService";
import {RefreshTokenService} from "./refreshTokenService";
import {SessionService} from "../../session/services/sessionServices";
import {getFormattedDate} from "../../../general/utilities";
import { v4 as uuidv4 } from 'uuid';
import {LoginResponseData} from "../dataModels";
import {PasswordService} from "../../user/services/passwordService";
import {UserService} from "../../user/services/userService";
import {passwordRecoveryEmailTemplate} from "../../../general/email-templates";
import {EmailService} from "../../user/services/emailService";

export class AuthService{
    constructor(
        protected sessionService: SessionService,
        protected refreshTokenService: RefreshTokenService,
        protected jwtTokenService: JwtTokenService,
        protected userService: UserService,
        protected passwordService: PasswordService,
        protected emailService: EmailService

    ) {}
    async login(
        ip: string,
        userAgent:string,
        user: JwtTokenData
    ): Promise<ServiceResult<LoginResponseData>>{
        const session = await this.sessionService.findOne({
            ip: ip,
            userId: user.userId,
            deviceName: userAgent
        });
        const issuedAt = await getFormattedDate();
        const newDeviceId = uuidv4();
        if (session.data){
            await this.sessionService.deleteById(session.data.deviceId, session.data.userId)
        }

        const refreshTokenData = await this.refreshTokenService.generate(
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

        await this.sessionService.create(
            userAgent,
            ip,
            newDeviceId,
            user.userId,
            refreshTokenData.data.expireAt,
            issuedAt
        );

        const token = await this.jwtTokenService.generate(user);
        return {
            data:
                {
                accessToken: token,
                refreshToken: refreshTokenData.data.token
            },
            status: true
        }
    };

    async refreshToken(
        ip: string,
        deviceId: string,
        user: JwtTokenData
    ): Promise<ServiceResult<LoginResponseData>>{
        const session = await this.sessionService.findOne({
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

        const refreshTokenData = await this.refreshTokenService.generate(
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

        await this.sessionService.updateSession(newDeviceId, refreshTokenData.data.expireAt, issuedAt);
        const token = await this.jwtTokenService.generate(user);
        return {
            data:
                {
                    accessToken: token,
                    refreshToken: refreshTokenData.data.token
                },
            status: true
        }
    };

    async logOut(deviceId: string, userId: string): Promise<ServiceResult<LoginResponseData>>{
        if(!deviceId){
            return {data: null, status: false}
        }
        const isDeviceActive = await this.sessionService.deleteById(deviceId, userId);
        if (!isDeviceActive.status){
            return {data: null, status: false}
        }
        return {data: null, status: true}
    };

    async pswrdRecovery(email: string): Promise<ServiceResult<DefaultResult>>{
        if(!email){
            return {data: null, status: false}
        }
        const code = await this.passwordService.generateRecoveryCode();
        await this.userService.setRecoveryCode(code, email);
        const emailTemplate = passwordRecoveryEmailTemplate(code);
        await this.emailService.sendEmail(
            email,
            emailTemplate,
            `Password Recovery`
        );
        return {data: null, status: true}
    };

    async confirmNewPassword(pswrd: string, code: string): Promise<ServiceResult<DefaultResult>>{
        if (!pswrd && !code){
            return {data: null, status: false}
        }
        const user = await this.userService.getUserByRecoveryCode(code);
        if (!user.data){
            return {data: null, status: false, msg: { errorsMessages: [{ message: "Incorrect Code", field: "recoveryCode" }] }}
        }
        const hashedPswrd = await this.passwordService.hash(pswrd);
        await this.userService.updatePassword(hashedPswrd, user.data.email, user.data.password);
        return {data: null, status: true}
    };
}