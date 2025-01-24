import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {consts} from "./global-consts";

dotenv.config()
export const mailService= (() => {
    const transport =  nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PSWRD,
        }
    });

    return {

        async sendEmail(to: string, content: string, subject: string = "", from: string = consts.DEFAULT_FROM_EMAIL):Promise<boolean>{
            const mail = {
                from: from,
                to: to,
                subject: subject,
                html: content
            }
            console.log("sendEmail called")
            await transport.sendMail(mail, (error, info) => {
                if (error) {
                    console.error("Error sending email: ", error);
                    return false
                }
                console.log("Email sent: ", info.response);
                return true
            });
            return true
        }
    };
})();