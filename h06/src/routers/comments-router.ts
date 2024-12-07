import {Request, Response, Router} from "express";
import {userValidation} from "../midlewares/validations/user-validation";
import {userHelper} from "../business-logic/user-business-logic";
import {validationParser} from "../midlewares/validations/validation-parser";
import {getUserParamExtander} from "../midlewares/extanders/get-req-param-extanders";
import {authorization1, jwtTokenAuthorization} from "../midlewares/validations/authorization";
import {commentValidation} from "../midlewares/validations/comment-validation";
import {queryIdValidator} from "../midlewares/validations/req-query-id-check";
import {commentDbHandlerClass} from "../db-handlers/comment-db-handler";
export const commentRouter = Router({});

const commentDbHandler = new commentDbHandlerClass();
commentRouter.get("/:id",
    queryIdValidator,
    validationParser,
    async (req: Request, resp: Response) =>{
        const comment = commentDbHandler.get(req.query.id as string);
        if (!comment){
            resp.sendStatus(404);
            return;
        }
        resp
            .status(200)
            .json(comment);
        return;
    })

commentRouter.put("/:id",
    jwtTokenAuthorization,
    queryIdValidator,
    commentValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
        const isUpdated = await commentDbHandler.update(
            req.query.id as string,
            req.body
        )
        if(!isUpdated){
            resp.sendStatus(404);
            return
        }

        resp.sendStatus(204);
        return

    })

commentRouter.delete("/:id",
    jwtTokenAuthorization,
    queryIdValidator,
    validationParser,
    async (req: Request, resp: Response) =>{
    const isDeleted = await commentDbHandler.delete(req.query.id as string);
    if (!isDeleted){
        resp.sendStatus(404);
        return;
    }

    resp.sendStatus(204);
    return;
    })