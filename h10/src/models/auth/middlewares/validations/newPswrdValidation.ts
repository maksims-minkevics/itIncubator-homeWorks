import {checkSchema} from "express-validator";

export const newPswrdValidation = checkSchema({
    password: {
        trim: true,
        isLength:{
            options: {
                min: 6,
                max: 20
            }
        },
        isString: true
    }
});