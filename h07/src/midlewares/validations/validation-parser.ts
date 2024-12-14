import {NextFunction, Request, Response} from "express";
import {validationResult, ResultFactory} from "express-validator";
const customValidator: ResultFactory<any> = validationResult.withDefaults({
    formatter: (error: any) => {
        return {
            message: error.msg,
            field: error.path
        };
    }
});

export const validationParser = (req: Request, resp: Response, next: NextFunction) =>{
    const errors = customValidator(req);
    console.log(errors)
    if (!errors.isEmpty()){
        resp
            .status(400)
            .json({errorsMessages: errors.array({ onlyFirstError: true })})
        return;
    }
    next();
}