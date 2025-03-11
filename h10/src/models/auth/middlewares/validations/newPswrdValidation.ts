import {checkSchema} from "express-validator";

export const newPswrdValidation = checkSchema({
    newPassword: {
        trim: true,
        isLength:{
            options: {
                min: 6,
                max: 20
            }
        },
        isString: true
    },
    recoveryCode: {
        trim: true,
        isLength:{
            options: {
                min: 1
            }
        },
        isString: true
    }
});