import {checkSchema} from "express-validator";
export const postDataValidation = checkSchema({
    title: {
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 30
            }
        },
        isString: true
    },
    shortDescription: {
        trim: true,
        isLength:{
            options: {
                min: 1,
                max: 100
            }
        },
        isString: true
    },
    content: {
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 1000
            }
        },
        isString: true
    },
    blogId: {
        trim: true,
        isLength: {
            options: {
                min: 1
            }
        },
        isString: true,
    }
});