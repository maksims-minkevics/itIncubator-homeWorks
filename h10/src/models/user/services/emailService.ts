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

    async sendEmail (to: string, content: string, subject: string, from = ""){
        await this.emailService.sendEmail(to, content, subject, from);
    }

}
