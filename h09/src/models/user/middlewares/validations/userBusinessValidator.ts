import { userRepository } from "../../repositories";
import { UserDataValidationResult, UserInputModel } from "../../dataModels";

export const userBusinessValidator = {

    async isEmailUnique(email: string): Promise<boolean> {
        return (await userRepository.findByField("email", email)) === null;
    },

    async isLoginUnique(login: string): Promise<boolean> {
        return (await userRepository.findByField("login", login)) === null;
    },

    async validateUserData(user: UserInputModel): Promise<UserDataValidationResult> {
        if (!await this.isLoginUnique(user.login)) {
            return {
                _isValidationFailed: true,
                data: { errorsMessages: [{ message: "Login should be unique", field: "login" }] },
            };
        }

        if (!await this.isEmailUnique(user.email)) {
            return {
                _isValidationFailed: true,
                data: { errorsMessages: [{ message: "Email should be unique", field: "email" }] },
            };
        }

        return { _isValidationFailed: false, data: {} };
    },
};
