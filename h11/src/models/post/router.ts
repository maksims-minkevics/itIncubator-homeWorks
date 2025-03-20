import {Router} from "express";
import {postDataValidation} from "./middleware/validations/postDataValidation";
import {validationParser} from "../../globals/middleware/validation-parser";
import {authorization1, jwtTokenAuth} from "../auth/authorization";
import {commentValidation} from "../comment/middleware/validations/commentDataValidation";
import {POSTS_ENDPOINTS} from "./endpoints";
import {idValidator} from "./middleware/validations/postIdValidation";
import {getPostQueryExtander} from "./middleware/extenders/postGetQueryExtander";
import {objectIdValidator} from "../../globals/middleware/validators/mongoDbIdValidator";
import {ioc} from "../../general/composition-root";
import {PostController} from "./controller";
export const postRouter = Router();
const postsControllerInstance = ioc.getInstance(PostController);
postRouter.get(
    POSTS_ENDPOINTS.GET,
    getPostQueryExtander,
    postsControllerInstance.getAll.bind(postsControllerInstance)
);

postRouter.get(
    POSTS_ENDPOINTS.GET_BY_ID(':id'),
    objectIdValidator,
    postsControllerInstance.getById.bind(postsControllerInstance)
);

postRouter.delete(
    POSTS_ENDPOINTS.DELETE_BY_ID(':id'),
    authorization1,
    objectIdValidator,
    postsControllerInstance.deleteById.bind(postsControllerInstance)
);

postRouter.put(
    POSTS_ENDPOINTS.UPDATE_BY_ID(':id'),
    authorization1,
    objectIdValidator,
    postDataValidation,
    validationParser,
    postsControllerInstance.updateById.bind(postsControllerInstance)
);

postRouter.post(
    POSTS_ENDPOINTS.CREATE,
    authorization1,
    postDataValidation,
    validationParser,
    postsControllerInstance.create.bind(postsControllerInstance)
);

postRouter.post(
    POSTS_ENDPOINTS.CREATE_COMMENT_FOR_SPECIFIC_POST(':id'),
    jwtTokenAuth,
    objectIdValidator,
    commentValidation,
    validationParser,
    postsControllerInstance.createComment.bind(postsControllerInstance)
);

postRouter.get(
    POSTS_ENDPOINTS.GET_COMMENTS_FOR_SPECIFIC_POST(':id'),
    objectIdValidator,
    getPostQueryExtander,
    idValidator,
    validationParser,
    postsControllerInstance.getCommentsByPostId.bind(postsControllerInstance)
);