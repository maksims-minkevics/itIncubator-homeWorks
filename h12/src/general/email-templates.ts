import {BASE_URL} from "./global-consts";

export const registrationEmailTemplate = (confirmationCode: string) => {
    return `
    <h1>Thanks for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://it-incubator-home-works.vercel.app${BASE_URL}/registration-confirmation/?code=${confirmationCode}'>complete registration</a>
    </p>
    `;
};

export const passwordRecoveryEmailTemplate = (tempsPassword: string) => {
    return `
        <h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
        <a href='https://it-incubator-home-works.vercel.app${BASE_URL}/password-recovery?recoveryCode=${tempsPassword}'>recovery password</a>
        </p>
    `;
};