import {DefaultResult, JwtTokenData, ServiceResult,} from "../../../general";
import jwt from 'jsonwebtoken';
import {consts} from "../../../general/global-consts";
import {settings} from "../../../settings";
import bcrypt from "bcrypt";

if (!process.env.JWTTOKEN_SALT) {
    throw new Error("Environment variable JWTTOKEN_SALT is not defined");
}

export class JwtTokenService {
    protected jwtTokenSalt: string;
    constructor() {
        this.jwtTokenSalt = process.env.JWTTOKEN_SALT || consts.DEFAULT_JWT_SALT;

    }
    async generate(user: JwtTokenData): Promise<string> {
        return jwt.sign(
            user,
            this.jwtTokenSalt,
            {expiresIn: settings.AUTH_TOKEN_EXP_TIME});
    };

    async verify(token: string): Promise<ServiceResult<JwtTokenData>> {
        try {
            return {data: jwt.verify(token, this.jwtTokenSalt) as JwtTokenData, status: true};
        } catch (error) {
            return {data: null, status: false};
        }
    };

    async decode(token: string): Promise<JwtTokenData> {
        const decoded = jwt.verify(token, this.jwtTokenSalt);
        return decoded as JwtTokenData;
    };

    async compare(pswrdHash: string, pawrd: string): Promise<ServiceResult<DefaultResult>> {
        try {
            const result = await bcrypt.compare(pawrd, pswrdHash);
            if (!result) {
                throw Error("Compare Failed")
            }
            return {data: null, status: true};
        } catch (e) {
            console.error("Password compare failed", e);
            return {data: null, status: true};
        }
    };
}