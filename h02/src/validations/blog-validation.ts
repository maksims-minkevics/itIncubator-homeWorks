import {checkSchema} from "express-validator";

export const blogValidation = checkSchema({
    name: {
        isLength: {
            options: {
                min: 1,
                max: 15 }
        },
        isString: true
    },
    description: {
        isLength:{
            options: {
                min: 1,
                max: 500
            }
        },
        isString: true
    },
    websiteUrl: {
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