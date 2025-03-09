import {JwtTokenData} from "../../general";

export type RefreshJwtTokenData = {
    token: string,
    deviceId: string,
    user: JwtTokenData,
    expireAt: string,
    issuedAt: string
}
export type RefreshTokenData = {
    token: string,
    expireAt: string,
}

export type LoginResponseData = {
    accessToken: string,
    refreshToken: string,
}

export type ActiveUserViewModel = {
    email: string,
    login: string,
    userId: string
}