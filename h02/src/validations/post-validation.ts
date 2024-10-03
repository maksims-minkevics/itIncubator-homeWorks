import {PostViewModel, PostInputModel, PostError} from "../object-types";
import {NextFunction, Request, Response} from "express";
import {validationResult, body} from "express-validator";
class postDataValidatorClass{
    failedValidations: PostError[];
    reqBody: PostInputModel;
    constructor(reqBody : PostInputModel) {
        this.failedValidations = [];
        this.reqBody = reqBody;
    }
    validate (){
        this.validateContent();
        this.validateTitle();
        this.validateShortDescription();
        this.validateBlogId();

        return this.failedValidations
    }
    validateTitle(){

    }
    validateShortDescription(){

    }

    validateContent(){

    }

    validateBlogId(){

    }

};

export const postValidator = (req: Request, resp: Response, next: NextFunction) => {
    const inputDataValidator = new postDataValidatorClass(req);
};
