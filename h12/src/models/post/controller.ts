import { Request, Response } from "express";
import {HTTP_STATUS, SERVICE_CUSTOM_MSG} from "../../general/global-consts";
import {PostsService} from "./services/postsService";
import {CommentsService} from "../comment/services/commentService";

export class PostController {
    constructor(protected postsService: PostsService, protected commentsService: CommentsService) {
    }
    async getAll(req: Request, res: Response) {
        try {
            const posts = await this.postsService.find(
                req.query.sortBy as string,
                Number(req.query.sortDirection),
                Number(req.query.pageNumber),
                Number(req.query.pageSize),
                req.user.userId
            );
            return res
                .status(HTTP_STATUS.OK)
                .json(posts.data);

        } catch (error) {
            console.error("❌ PostController. Error in getAll:", error);
            return res
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({ message: "Internal Server Error" });
        }
    }


    async getById(req: Request, res: Response) {
        try {
            const post = await this.postsService.findById(req.params.id as string, req.user.userId)

            if (!post.status) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }
            return res
                .status(HTTP_STATUS.OK)
                .json(post.data);

        } catch (error) {
            console.error("❌ PostController. Error in getById:", error);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }

    async deleteById(req: Request, res: Response) {
        try {
            const isDeleted = await this.postsService.deleteById(req.params.id);
            if (!isDeleted.status) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }
            return res
                .status(HTTP_STATUS.NO_CONTENT)
                .end();

        } catch (error) {
            console.error("❌ PostController. Error in deleteById:", error);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }

    async updateById(req: Request, res: Response) {
        try {
            const isUpdated = await this.postsService.updateById(req.params.id, req.body);
            if (!isUpdated.status) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }
            return res
                .status(HTTP_STATUS.NO_CONTENT)
                .end();

        } catch (error) {
            console.error("❌ PostController. Error in updateById:", error);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const post = await this.postsService.createNew(req.body);
            if (!post.status){
                return res
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .end();
            }
            return res
                .status(HTTP_STATUS.CREATED)
                .json(post.data);

        } catch (error) {
            console.error("❌ PostController. Error in create:", error);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }
    async createComment(req: Request, res: Response) {
        try {
            const comment = await this.commentsService
                .create(req.params.id as string, req.user, req.body);
            if (comment.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }
            return res
                .status(HTTP_STATUS.CREATED)
                .json(comment.data);

        } catch (error) {
            console.error("❌ PostController. Error in createComment:", error);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }
    async getCommentsByPostId(req: Request, res: Response) {
        try {
            const comments = await this.commentsService.findManyByPostId(
                req.params.id as string,
                req.query.sortBy as string,
                Number(req.query.sortDirection),
                Number(req.query.pageNumber),
                Number(req.query.pageSize),
                req.user.userId
            );

            if ((comments.msg === SERVICE_CUSTOM_MSG.NOT_FOUND)) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }

            return res
                .status(HTTP_STATUS.OK)
                .json(comments.data);
        } catch (error) {
            console.error("❌ PostController. Error in getComments:", error);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }

    async likePost(req: Request, resp: Response){
        const result = await this.postsService.likePost(req.params.id, req.body.likeStatus, req.user.userId, req.user.userLogin);
        if (!result.status && result.msg){
            resp
                .status(HTTP_STATUS.NOT_FOUND)
                .end();
        }
        if (!result.status){
            resp
                .status(HTTP_STATUS.BAD_REQUEST)
                .end();
        }
        resp
            .status(HTTP_STATUS.NO_CONTENT)
            .end();
    }
}
