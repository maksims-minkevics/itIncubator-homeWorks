import { Router} from "express";
import { blogValidation } from "./middlewares/validations/blogDataValidation";
import { validationParser } from "../../globals/middleware/validation-parser";
import {authorization1} from "../auth/authorization";
import {getBlogQueryExtender} from "./middlewares/extenders/blogGetParamExtender";
import {BLOGS_ENDPOINTS} from "./endpoints";
import {postDataValidation} from "../post/middleware/validations/postDataValidation";
import {queryIdValidator} from "./middlewares/validations/blogIdValidation";
import {objectIdValidator} from "../../globals/middleware/validators/mongoDbIdValidator";
import {ioc} from "../../general/composition-root";
import {getBlogIdFromReq} from "./middlewares/extenders/blogExtenders";
import {BlogController} from "./controller";
import {getUserFromJwtToken} from "../../globals/middleware/extenders/getUserFromJwtToken";

export const blogRouter = Router();
const blogsControllerInstance = ioc.getInstance(BlogController);
blogRouter.get(
    BLOGS_ENDPOINTS.GET,
    getBlogQueryExtender,
    blogsControllerInstance.getAll.bind(blogsControllerInstance)
);

blogRouter.get(
    BLOGS_ENDPOINTS.GET_BY_ID(':id'),
    objectIdValidator,
    queryIdValidator,
    blogsControllerInstance.getById.bind(blogsControllerInstance)
);

blogRouter.delete(
    BLOGS_ENDPOINTS.DELETE_BY_ID(':id'),
    authorization1,
    objectIdValidator,
    queryIdValidator,
    blogsControllerInstance.deleteById.bind(blogsControllerInstance)
   );

blogRouter.put(
    BLOGS_ENDPOINTS.UPDATE_BY_ID(':id'),
    authorization1,
    objectIdValidator,
    blogValidation,
    validationParser,
    blogsControllerInstance.updateById.bind(blogsControllerInstance)
);

blogRouter.post(
    BLOGS_ENDPOINTS.CREATE,
    authorization1,
    blogValidation,
    validationParser,
    blogsControllerInstance.create.bind(blogsControllerInstance)
);


blogRouter.post(
    BLOGS_ENDPOINTS.CREATE_POST_FOR_SPECIFIC_BLOG(':id'),
    authorization1,
    objectIdValidator,
    queryIdValidator,
    getBlogIdFromReq,
    getBlogQueryExtender,
    postDataValidation,
    validationParser,
    blogsControllerInstance.createPost.bind(blogsControllerInstance)
);

blogRouter.get(
    BLOGS_ENDPOINTS.GET_POST_BY_BLOG_ID(':id'),
    objectIdValidator,
    queryIdValidator,
    getBlogQueryExtender,
    getUserFromJwtToken,
    blogsControllerInstance.getPostById.bind(blogsControllerInstance)
);