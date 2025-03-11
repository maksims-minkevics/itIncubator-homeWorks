import {UserInputModel} from "../../user/dataModels";
import {UserBusinessValidator} from "../../user/middlewares/validations/userBusinessValidator";
import {PasswordService} from "../../user/services/passwordService";
import {EmailService} from "../../user/services/emailService";
import {DefaultResult, ErrorResult, ServiceResult} from "../../../general";
import {UserService} from "../../user/services/userService";
import {registrationEmailTemplate} from "../../../general/email-templates";

export class RegistrationService{
    constructor(
        protected userBusinessValidator: UserBusinessValidator,
        protected userService: UserService,
        protected emailService: EmailService,
        protected passwordService: PasswordService
    ) {};

    async newUserRegistration(user: UserInputModel): Promise<ServiceResult<ErrorResult>> {
        const validationResult = await this.userBusinessValidator.validateUserData(user);
        if (!validationResult.status){
            return {data: null, status: false, msg: validationResult.data}
        }

        const hashedPswrd = await this.passwordService.hash(user.password);
        user.password = hashedPswrd;
        const confirmationCode = await this.emailService.generateConfirmationCode();

        const newUser = await this.userService
            .createUser(
                user,
                false,
                confirmationCode);
        if (!newUser.status){
            return { status: false, data: null, msg: newUser.msg};
        }

        if (!newUser.data){
            return { status: false, data: null, msg: newUser.msg};
        }
        const emailTemplate = registrationEmailTemplate(confirmationCode);
        await this.emailService.sendEmail(
            newUser.data.email,
            emailTemplate,
            `Test Email`
        );

        return { status: true, data: null };
    };

    async confirmRegistration(code: string): Promise<ServiceResult<ErrorResult>> {
        if (!code){
            return { status: false, data: null }
        }
        const isActivated = await this.userService.confirmCode(code);
        if (!isActivated.status) {
            return {
                status: false,
                data: null,
                msg: {errorsMessages: [{ message: "Incorrect code", field: "code" }]}
            };
        }
        return { status: true, data: null };
    };

    async resendConfirmationCode(email: string): Promise<ServiceResult<ErrorResult>> {
        const user = await this.userService.findByField({email:email});
        if (!user.status) {
            return {
                status: false,
                data: { errorsMessages: [{ message: "Incorrect email", field: "email" }] },
            };
        }

        if (!user.data) {
            return {
                status: false,
                data: null,
                msg: { errorsMessages: [{ message: "Incorrect email", field: "email" }] },
            };
        }

        if (user.data.isActivated) {
            return {
                status: false,
                data: null,
                msg: { errorsMessages: [{ message: "User has already been confirmed", field: "email" }] },
            };
        }

        const newCode = await this.emailService.generateConfirmationCode();
        const result = await this.userService.setNewConfirmationCode(email, newCode);
        if (!result.status){
            return {
                status: false,
                msg: { errorsMessages: [{ message: "Incorrect email", field: "email" }] },
                data: null
            };
        }
        return {status: true, data: null};
    }
}