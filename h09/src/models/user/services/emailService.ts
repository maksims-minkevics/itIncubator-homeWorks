import { userRepository } from "../repositories";
import {v4 as uuidv4} from "uuid";

export const emailService = {

    async generateConfirmationCode(): Promise<string> {
        return uuidv4();
    },

    async confirmEmail(code: string): Promise<boolean> {
        return await userRepository.confirmEmail(code);
    },

    async resendConfirmationCode(email: string) {
        const user = await userRepository.findByField("email", email);
        if (!user) {
            return {
                _isValidationFailed: true,
                data: { errorsMessages: [{ message: "Incorrect email", field: "email" }] },
            };
        }

        if (user.isActivated) {
            return {
                _isValidationFailed: true,
                data: { errorsMessages: [{ message: "User has already been confirmed", field: "email" }] },
            };
        }

        const newCode = await this.generateConfirmationCode();
        const updatedUser = await userRepository.updateUserConfirmationCode(newCode, email);

        return {
            _isValidationFailed: false,
            data: {},
            user: updatedUser,
        };
    },

    async sendEmail (to: string, content: string, subject: string, from = ""){
        await emailService.sendEmail(to, content, subject, from);
    }

};
