import {UserInputModel} from "../../user/dataModels";
import {userBusinessValidator} from "../../user/middlewares/validations/userBusinessValidator";
import {passwordService} from "../../user/services/passwordService";
import {emailService} from "../../user/services/emailService";
import {userRepository} from "../../user/repositories";
import {ErrorResult, ServiceResult} from "../../../general";
import {userService} from "../../user/services/userService";
import {registrationEmailTemplate} from "../../../general/email-templates";

export const registrationService = {
    async newUserRegistration(user: UserInputModel): Promise<ServiceResult<ErrorResult>> {
        const validationResult = await userBusinessValidator.validateUserData(user);
        if (!validationResult.status){
            return {data: null, status: false, msg: validationResult.data}
        }

        user.password = await passwordService.hash(user.password);
        const confirmationCode = await emailService.generateConfirmationCode();

        const newUser = await userService.createUser(user, false, confirmationCode);
        if (!newUser.status){
            return { status: false, data: null, msg: newUser.msg};
        }

        if (!newUser.data){
            return { status: false, data: null, msg: newUser.msg};
        }
        const emailTemplate = registrationEmailTemplate(confirmationCode);
        await emailService.sendEmail(
            newUser.data.email,
            emailTemplate,
            `Test Email`
        );

        return { status: true, data: null };
    },

    async confirmRegistration(code: string): Promise<ServiceResult<ErrorResult>> {
        if (!code){
            return { status: false, data: null }
        }
        const isActivated = await emailService.confirmEmail(code);
        if (!isActivated) {
            return {
                status: false,
                data: {errorsMessages: [{ message: "Incorrect code", field: "code" }]}
            };
        }
        return { status: true, data: null };
    },

    async resendConfirmationCode(email: string): Promise<ServiceResult<ErrorResult>> {
        const user = await userService.findByField({email:email});
        if (!user.status) {
            return {
                status: false,
                data: { errorsMessages: [{ message: "Incorrect email", field: "email" }] },
            };
        }

        if (!user.data) {
            return {
                status: false,
                data: { errorsMessages: [{ message: "Incorrect email", field: "email" }] },
            };
        }

        if (user.data.isActivated) {
            return {
                status: false,
                data: { errorsMessages: [{ message: "User has already been confirmed", field: "email" }] },
            };
        }

        const newCode = await emailService.generateConfirmationCode();
        await userRepository.updateUserConfirmationCode(newCode, email);
        return {status: true, data: null};
    },
}