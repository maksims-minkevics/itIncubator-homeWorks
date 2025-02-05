import { userRepository } from "../repositories";
import {  UserInputModel, UserDataValidationResult } from "../dataModels";
import { passwordService } from "./passwordService";
import { emailService } from "./emailService";
import {userBusinessValidator} from "../middlewares/validations/userBusinessValidator";

export const userService = {
    async newUserRegistration(user: UserInputModel): Promise<UserDataValidationResult> {
        const validationResult = await userBusinessValidator.validateUserData(user);
        if (validationResult._isValidationFailed) return validationResult;

        user.password = await passwordService.hash(user.password);
        const confirmationCode = await emailService.generateConfirmationCode();

        const newUser = await userRepository.create(user, false, confirmationCode);

        await emailService.sendEmail(
            newUser.email,
            "Confirm your email",
            `Your confirmation code: ${confirmationCode}`
        );

        return { _isValidationFailed: false, data: {}, user: newUser };
    },

    async confirmRegistration(code: string): Promise<UserDataValidationResult> {
        const isActivated = await emailService.confirmEmail(code);
        if (!isActivated) {
            return {
                _isValidationFailed: true,
                data: { errorsMessages: [{ message: "Incorrect code", field: "code" }] },
            };
        }
        return { _isValidationFailed: false, data: {} };
    },
};
