import {NextFunction, Request, Response} from "express";
import {validationResult, ResultFactory} from "express-validator";
import {HTTP_STATUS} from "../../general/global-consts";
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
    if (!errors.isEmpty()){
        return resp
            .status(HTTP_STATUS.BAD_REQUEST)
            .json({
                errorsMessages: errors.array({ onlyFirstError: true })
            });
    }

    return next();
}