import {Router} from "express";
import {validationParser} from "../../midlewares/validation-parser";
import {jwtTokenAuth} from "../auth/authorization";
import {commentValidation} from "./middleware/validations/commentDataValidation";
import {idValidator} from "../comment/middleware/validations/commentIdValidation";
import {COMMENTS_ENDPOINTS} from "./endpoints";
import {CommentController} from "./controller";
import {objectIdValidator} from "../../globals/middleware/validators/mongoDbIdValidator";
export const commentRouter = Router();

commentRouter.get(
    COMMENTS_ENDPOINTS.GET_BY_ID(':id'),
    objectIdValidator,
    idValidator,
    validationParser,
    CommentController.getById
)

commentRouter.put(
    COMMENTS_ENDPOINTS.UPDATE_BY_ID(':id'),
    jwtTokenAuth,
    objectIdValidator,
    idValidator,
    commentValidation,
    validationParser,
    CommentController.updateById)

commentRouter.delete(
    COMMENTS_ENDPOINTS.DELETE_BY_ID(':id'),
    jwtTokenAuth,
    objectIdValidator,
    idValidator,
    validationParser,
    CommentController.deleteById)