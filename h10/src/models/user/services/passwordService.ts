import bcrypt from "bcrypt";
import {consts} from "../../../general/global-consts";
import {v4 as uuidv4} from "uuid";
import {DefaultResult, ServiceResult} from "../../../general";

export class PasswordService{
    async hash(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, consts.SALT_ROUNDS);
        } catch (e) {
            console.error("Password hash failed", e);
            throw new Error("Failed to hash password");
        }
    };

    async compare(passwordHash: string, password: string): Promise<ServiceResult<DefaultResult>> {
        try {
            const result = await bcrypt.compare(password, passwordHash);
            if (!result) {
                throw Error("Compare Failed");
            }
            return {data: null, status: true};
        } catch (e) {
            console.error("Password compare failed", e);
            return {data: null, status: false};
        }
    };

    async generateRecoveryCode(): Promise<string>{
        return uuidv4()
    }
}
