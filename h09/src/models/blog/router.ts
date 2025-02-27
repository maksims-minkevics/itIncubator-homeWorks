import { Router} from "express";
import { blogValidation } from "./middlewares/validations/blogDataValidation";
import { validationParser } from "../../midlewares/validation-parser";
import {authorization1} from "../auth/authorization";
import {getBlogQueryExtender} from "./middlewares/extenders/blogGetParamExtender";
import {BlogController} from "./controller";
import {BLOGS_ENDPOINTS} from "./endpoints";
import {postDataValidation} from "../post/middleware/validations/postDataValidation";
import {queryIdValidator} from "./middlewares/validations/blogIdValidation";
import {objectIdValidator} from "../../globals/middleware/validators/mongoDbIdValidator";

export const blogRouter = Router();

blogRouter.get(
    BLOGS_ENDPOINTS.GET,
    getBlogQueryExtender,
    BlogController.getAll
);

blogRouter.get(
    BLOGS_ENDPOINTS.GET_BY_ID(':id'),
    objectIdValidator,
    queryIdValidator,
    BlogController.getById
);

blogRouter.delete(
    BLOGS_ENDPOINTS.DELETE_BY_ID(':id'),
    authorization1,
    objectIdValidator,
    queryIdValidator,
    BlogController.deleteById
   );

blogRouter.put(
    BLOGS_ENDPOINTS.UPDATE_BY_ID(':id'),
    authorization1,
    objectIdValidator,
    blogValidation,
    validationParser,
    BlogController.updateById);

blogRouter.post(
    BLOGS_ENDPOINTS.CREATE,
    authorization1,
    blogValidation,
    validationParser,
    BlogController.create);


blogRouter.post(
    BLOGS_ENDPOINTS.CREATE_POST_FOR_SPECIFIC_BLOG(':id'),
    authorization1,
    objectIdValidator,
    queryIdValidator,
    getBlogQueryExtender,
    postDataValidation,
    validationParser,
    BlogController.createPost
);

blogRouter.get(
    BLOGS_ENDPOINTS.GET_POST_BY_BLOG_ID(':id'),
    objectIdValidator,
    queryIdValidator,
    getBlogQueryExtender,
    BlogController.getPostById
);