import { userRepository } from "../repositories";
import {v4 as uuidv4} from "uuid";

export const emailService = {

    async generateConfirmationCode(): Promise<string> {
        return uuidv4();
    },

    async confirmEmail(code: string): Promise<boolean> {
        return await userRepository.confirmEmail(code);
    },

    async sendEmail (to: string, content: string, subject: string, from = ""){
        await emailService.sendEmail(to, content, subject, from);
    }

};
