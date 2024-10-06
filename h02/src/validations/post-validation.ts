import {checkSchema, CustomValidator} from "express-validator";
import {postDbHandlerClass} from "../db-handlers/posts-db-handler";
const posDbHandler = new postDbHandlerClass();
export const postValidation = checkSchema({
    title: {
        isLength: {
            options: {
                min: 1,
                max: 30
            }
        },
        isString: true
    },
    shortDescription: {
        isLength:{
            options: {
                min: 1,
                max: 100
            }
        },
        isString: true
    },
    content: {
        isLength: {
            options: {
                min: 1,
                max: 1000
            }
        },
        isString: true
    },
    blogId: {
        isLength: {
            options: {
                min: 1
            }
        },
        isString: true,
        custom: {
            options: posDbHandler.checkId
        }
    }
}, ['body']);