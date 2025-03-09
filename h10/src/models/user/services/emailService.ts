import {v4 as uuidv4} from "uuid";
import {UserService} from "./userService";
import {DefaultResult, ServiceResult} from "../../../general";
import {GenericEmailService} from "../../../general/email-service";

export class EmailService{
    constructor(protected userService: UserService, protected emailService: GenericEmailService) {
    }

    async generateConfirmationCode(): Promise<string> {
        return uuidv4();
    };

    async confirmEmail(code: string): Promise<ServiceResult<DefaultResult>> {
        const result = await this.userService.confirmCode(code);
        if (!result){
            return {data: null, status: false}
        }

        if (!result.status){
            return {data: null, status: false}
        }

        return {data: null, status: true}
    };

    async sendEmail (to: string, content: string, subject: string, from = ""){
        await this.emailService.sendEmail(to, content, subject, from);
    }

}
