import {checkSchema} from "express-validator";

export const pswrdRecoveryValidation = checkSchema({
    email: {
        trim: true,
        isString: true,
        matches :{
            options: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/]
        }
    }
});