import {Router} from "express";
import {validationParser} from "../../globals/middleware/validation-parser";
import {jwtTokenAuth} from "../auth/authorization";
import {commentLikeValidation, commentValidation} from "./middleware/validations/commentDataValidation";
import {idValidator} from "./middleware/validations/commentIdValidation";
import {COMMENTS_ENDPOINTS} from "./endpoints";
import {objectIdValidator} from "../../globals/middleware/validators/mongoDbIdValidator";
import {ioc} from "../../general/composition-root";
import {CommentController} from "./controller";
export const commentRouter = Router();
const commentsControllerInstance = ioc.getInstance(CommentController);

commentRouter.get(
    COMMENTS_ENDPOINTS.GET_BY_ID(':id'),
    objectIdValidator,
    idValidator,
    validationParser,
    commentsControllerInstance.getById.bind(commentsControllerInstance)
)

commentRouter.put(
    COMMENTS_ENDPOINTS.UPDATE_BY_ID(':id'),
    jwtTokenAuth,
    objectIdValidator,
    idValidator,
    commentValidation,
    validationParser,
    commentsControllerInstance.updateById.bind(commentsControllerInstance)
)

commentRouter.delete(
    COMMENTS_ENDPOINTS.DELETE_BY_ID(':id'),
    jwtTokenAuth,
    objectIdValidator,
    idValidator,
    validationParser,
    commentsControllerInstance.deleteById.bind(commentsControllerInstance)
)

commentRouter.put(
    COMMENTS_ENDPOINTS.DELETE_BY_ID(':id'),
    jwtTokenAuth,
    objectIdValidator,
    idValidator,
    commentLikeValidation,
    validationParser,
    commentsControllerInstance.likeComment.bind(commentsControllerInstance)
)