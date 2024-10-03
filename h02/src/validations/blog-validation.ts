import {BlogViewModel, BlogError} from "../object-types";
class blogDataValidatorClass{
    failedValidations: BlogError[];
    reqBody:BlogViewModel;
    constructor(reqBody : BlogViewModel) {
        this.failedValidations = [];
        this.reqBody = reqBody;
    }
    validate (){

    }

};
export {blogDataValidatorClass};