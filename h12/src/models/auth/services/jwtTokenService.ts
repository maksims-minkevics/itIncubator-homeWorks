import {ActiveUserData, ServiceResult,} from "../../../general";
import jwt from 'jsonwebtoken';
import {consts} from "../../../general/global-consts";
import {settings} from "../../../settings";

if (!process.env.JWTTOKEN_SALT) {
    throw new Error("Environment variable JWTTOKEN_SALT is not defined");
}

export class JwtTokenService {
    protected jwtTokenSalt: string;
    constructor() {
        this.jwtTokenSalt = process.env.JWTTOKEN_SALT || consts.DEFAULT_JWT_SALT;

    }
    async generate(user: ActiveUserData): Promise<string> {
        return jwt.sign(
            user,
            this.jwtTokenSalt,
            {expiresIn: settings.AUTH_TOKEN_EXP_TIME});
    };

    async verify(token: string): Promise<ServiceResult<ActiveUserData>> {
        try {
            return {data: jwt.verify(token, this.jwtTokenSalt) as ActiveUserData, status: true};
        } catch (error) {
            return {data: null, status: false};
        }
    };

    async decode(token: string): Promise<ActiveUserData> {
        const decoded = jwt.verify(token, this.jwtTokenSalt);
        return decoded as ActiveUserData;
    };

}