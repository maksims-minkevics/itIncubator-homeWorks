import {NextFunction, Request, Response} from "express";
import {validationResult, ResultFactory} from "express-validator";
const customValidator: ResultFactory<any> = validationResult.withDefaults({
    formatter: (error) => {
        return {
            message: error.msg as string,
            field: error.path as string,
        };
    }
});

export const validationParser = (req: Request, resp: Response, next: NextFunction) =>{
    const errors = customValidator(req);
    if (!errors.isEmpty()){
        resp
            .status(400)
            .json({errorsMessages: errors.array({ onlyFirstError: true })})
        return;
    }
    next();
}