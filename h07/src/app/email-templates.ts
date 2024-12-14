import dotenv from "dotenv";

dotenv.config()
export const registrationEmailTemplate = (confirmationCode: string) => `
    <h1>Thanks for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://it-incubator-home-works.vercel.app/${process.env.BASE_URL}/registration-confirmation/?code=${confirmationCode}'>complete registration</a>
    </p>
`;