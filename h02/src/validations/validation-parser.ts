import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
export const validationParser = (req: Request, resp: Response, next: NextFunction) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        resp
            .status(400)
            .json(validationResult(req).array({ onlyFirstError: true }))
        return;
    }
    next();
}