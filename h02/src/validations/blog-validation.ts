import {checkSchema} from "express-validator";

export const blogValidation = checkSchema({
    name: {
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 15 }
        },
        isString: true
    },
    description: {
        trim: true,
        isLength:{
            options: {
                min: 1,
                max: 500
            }
        },
        isString: true
    },
    websiteUrl: {
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 100
            }
        },
        isURL: {
            options: {
                protocols: ['http', 'https'],
                require_protocol: true,
            }
        }
    }
}, ['body']);