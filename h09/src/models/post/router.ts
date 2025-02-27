import {Router} from "express";
import {postDataValidation} from "./middleware/validations/postDataValidation";
import {validationParser} from "../../midlewares/validation-parser";
import {authorization1, jwtTokenAuth} from "../auth/authorization";
import {commentValidation} from "../comment/middleware/validations/commentDataValidation";
import {PostController} from "./controller";
import {POSTS_ENDPOINTS} from "./endpoints";
import {idValidator} from "./middleware/validations/postIdValidation";
import {getPostQueryExtander} from "./middleware/extenders/postGetQueryExtander";
import {objectIdValidator} from "../../globals/middleware/validators/mongoDbIdValidator";
export const postRouter = Router();

postRouter.get(
    POSTS_ENDPOINTS.GET,
    getPostQueryExtander,
    PostController.getAll
);

postRouter.get(
    POSTS_ENDPOINTS.GET_BY_ID(':id'),
    objectIdValidator,
    PostController.getById
);

postRouter.delete(
    POSTS_ENDPOINTS.DELETE_BY_ID(':id'),
    authorization1,
    objectIdValidator,
    PostController.deleteById
);

postRouter.put(
    POSTS_ENDPOINTS.UPDATE_BY_ID(':id'),
    authorization1,
    objectIdValidator,
    postDataValidation,
    validationParser,
    PostController.updateById
);

postRouter.post(
    POSTS_ENDPOINTS.CREATE,
    authorization1,
    postDataValidation,
    validationParser,
    PostController.create
);

postRouter.post(
    POSTS_ENDPOINTS.CREATE_COMMENT_FOR_SPECIFIC_POST(':id'),
    jwtTokenAuth,
    objectIdValidator,
    commentValidation,
    validationParser,
    PostController.createComment
);

postRouter.get(
    POSTS_ENDPOINTS.GET_COMMENTS_FOR_SPECIFIC_POST(':id'),
    objectIdValidator,
    getPostQueryExtander,
    idValidator,
    validationParser,
    PostController.getCommentsByPostId
);