import { UserInputModel } from "../../dataModels";
import {ErrorResult, ServiceResult} from "../../../../general";
import {UserRepository} from "../../repository";

export class UserBusinessValidator {
    constructor(protected userRepository: UserRepository) {
    };

    async isEmailUnique(email: string): Promise<boolean> {
        return (await this.userRepository.findByField({email: email})) === null;
    };

    async isLoginUnique(login: string): Promise<boolean> {
        return (await this.userRepository.findByField({login: login})) === null;
    };

    async validateUserData(user: UserInputModel): Promise<ServiceResult<ErrorResult>> {
        if (!await this.isLoginUnique(user.login)) {
            return {
                status: false,
                data: { errorsMessages: [{ message: "Login should be unique", field: "login" }] },
            };
        }

        if (!await this.isEmailUnique(user.email)) {
            return {
                status: false,
                data: { errorsMessages: [{ message: "Email should be unique", field: "email" }] },
            };
        }
        return { status: true, data: null }
    }
}
