import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { consts } from "./global-consts";

dotenv.config();

export class GenericEmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PSWRD,
            },
        });
    }


    async sendEmail(
        to: string,
        content: string,
        subject: string = "",
        from: string = consts.DEFAULT_FROM_EMAIL
    ): Promise<boolean> {
        try {
            const mailOptions = {
                from,
                to,
                subject,
                html: content,
            };

            const info = await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }
}
