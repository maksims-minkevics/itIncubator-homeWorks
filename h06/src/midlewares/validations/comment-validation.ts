import {checkSchema} from "express-validator";

export const commentValidation = checkSchema({
    content: {
        trim: true,
        isLength: {
            options: {
                min: 20,
                max: 300
            }
        },
        isString: true,
}});