import {Request, Response, Router} from "express";
import {validationParser} from "../midlewares/validations/validation-parser";
import {jwtTokenAuthorization} from "../midlewares/validations/authorization";
import {commentValidation} from "../midlewares/validations/comment-validation";
import {queryIdValidator} from "../midlewares/validations/req-query-id-check";
import {commentDbHandlerClass} from "../db-handlers/comment-db-handler";
export const commentRouter = Router({});

const commentDbHandler = new commentDbHandlerClass();
commentRouter.get("/:id",
    queryIdValidator,
    validationParser,
    async (req: Request, resp: Response) =>{
        const comment = await commentDbHandler.get(req.params.id as string);
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
            req.params.id as string,
            req.body,
            req.user
        )
        if(isUpdated === undefined){
            resp.sendStatus(404);
            return
        }

        if(!isUpdated){
            resp.sendStatus(403);
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
    const isDeleted = await commentDbHandler.delete(
        req.params.id as string,
        req.user);
        if(isDeleted === undefined){
            resp.sendStatus(404);
            return
        }

        if(!isDeleted){
            resp.sendStatus(403);
            return
        }

    resp.sendStatus(204);
    return;
    })