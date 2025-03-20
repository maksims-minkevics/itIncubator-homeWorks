import {checkSchema} from "express-validator";

export const userValidator = checkSchema({
    login: {
        trim: true,
        isLength: {
            options: {
                min: 3,
                max: 10
            }
        },
        isString: true,
        matches :{
            options: [/^[a-zA-Z0-9_-]*$/]
        }
    },
    password: {
        trim: true,
        isLength:{
            options: {
                min: 6,
                max: 20
            }
        },
        isString: true
    },
    email: {
        trim: true,
        isString: true,
        matches :{
            options: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/]
        }
    }
});