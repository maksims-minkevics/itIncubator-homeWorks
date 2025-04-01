import {Request, Response} from "express";
import {HTTP_STATUS, SERVICE_CUSTOM_MSG} from "../../general/global-consts";
import {BlogsService} from "./services/blogService";
import {PostsService} from "../post/services/postsService";
import {PostInputModel} from "../post/dataModels";

export class BlogController {
    constructor(protected blogsService: BlogsService, protected postsService: PostsService) {
    }
    async getAll(req: Request, resp: Response) {
        try {
            const blogs = await this.blogsService.findMany(
                req.query.searchNameTerm as string,
                req.query.sortBy as string,
                Number(req.query.sortDirection),
                Number(req.query.pageNumber),
                Number(req.query.pageSize)
            );
            return resp
                .status(HTTP_STATUS.OK)
                .json(blogs.data);

        } catch (error) {
            console.error("Error in BlogController getAll:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    async getById(req: Request, resp: Response) {
        try {
            const blog = await this.blogsService.findOneById(req.params.id);

            if (blog.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
                resp
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
                return;
            }

            return resp
                .status(HTTP_STATUS.OK)
                .json(blog.data);

        } catch (error) {
            console.error("Error in BlogController getById:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    async deleteById(req: Request, resp: Response) {
        try {
            const deletedBlogId = await this.blogsService.deleteOneById(req.params.id);
            if (deletedBlogId.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
                return resp
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }
            return resp
                .status(HTTP_STATUS.NO_CONTENT)
                .end();

        } catch (error) {
            console.error("Error in BlogController deleteById:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    }

    async updateById(req: Request, resp: Response) {
        try {
            const blogId = req.params.id;
            const updatedBlog = await this.blogsService.updateOneById(blogId, req.body);
            if (updatedBlog.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
                return resp
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }
            return resp
                .status(HTTP_STATUS.NO_CONTENT)
                .end();

        } catch (error) {
            console.error("Error in BlogController updateById:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    async create(req: Request, resp: Response) {
        try {
            const blog = await this.blogsService.create(req.body);
            if (!blog.status) {
                return resp
                    .status(HTTP_STATUS.SERVER_ERROR)
                    .end()
            }
            return resp
                .status(HTTP_STATUS.CREATED)
                .json(blog.data);

        } catch (error) {
            console.error("Error in BlogController getById:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    async createPost(req: Request, resp: Response) {
        try {
            const blogId = req.params.id;
            const postData: PostInputModel = {...req.body, blogId};
            const post = await this.postsService.createNew(postData);
            if (post.msg === SERVICE_CUSTOM_MSG.NOT_FOUND){
                return resp
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }

            return resp
                .status(HTTP_STATUS.CREATED)
                .json(post.data);

        } catch (error) {
            console.error("Error in BlogController getById:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

    async getPostById(req: Request, resp: Response) {
        try {
                const blogId = req.params.id;
                const posts = await this.postsService.findByBlogId(
                    blogId,
                    req.query.sortBy as string,
                    Number(req.query.sortDirection),
                    Number(req.query.pageNumber as string),
                    Number(req.query.pageSize as string),
                    req.user.userId
                );
                if(posts.msg === SERVICE_CUSTOM_MSG.NOT_FOUND){
                    return resp
                        .status(HTTP_STATUS.NOT_FOUND)
                        .end();
                }

                return resp
                    .status(HTTP_STATUS.OK)
                    .json(posts.data);

        } catch (error) {
            console.error("Error in BlogController getById:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }
    };

}