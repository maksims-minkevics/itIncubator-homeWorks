import bcrypt from "bcrypt";
import {consts} from "../../../general/global-consts";

export const passwordService = {
    async hash(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, consts.SALT_ROUNDS);
        } catch (e) {
            console.error("Password hash failed", e);
            throw new Error("Failed to hash password");
        }
    },

    async compare(passwordHash: string, password: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, passwordHash);
        } catch (e) {
            console.error("Password compare failed", e);
            return false;
        }
    },
};
