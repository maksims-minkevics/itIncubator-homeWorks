import {checkSchema} from "express-validator";

export const authValidation = checkSchema({
    loginOrEmail: {
        trim: true,
        isString: true,
    },
    password: {
        trim: true,
        isString: true
    }
})