import { Request, Response } from "express";
import {HTTP_STATUS, SERVICE_CUSTOM_MSG} from "../../general/global-consts";
import { postService } from "./services/postsService";
import { commentService } from "../comment/services/commentService";

export class PostController {
    static async getAll(req: Request, res: Response) {
        try {
            const posts = await postService.find(
                req.query.sortBy as string,
                Number(req.query.sortDirection),
                Number(req.query.pageNumber),
                Number(req.query.pageSize),
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


    static async getById(req: Request, res: Response) {
        try {
            const post = await postService.findById(req.params.id as string)

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

    static async deleteById(req: Request, res: Response) {
        try {
            const isDeleted = await postService.deleteById(req.params.id);
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

    static async updateById(req: Request, res: Response) {
        try {
            const isUpdated = await postService.updateById(req.params.id, req.body);
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

    static async create(req: Request, res: Response) {
        try {
            const post = await postService.createNew(req.body);
            if (!post.status){
                return res
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .end();
            }
            return res
                .status(HTTP_STATUS.CREATED)
                .json(post);

        } catch (error) {
            console.error("❌ PostController. Error in create:", error);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }
    static async createComment(req: Request, res: Response) {
        try {
            const comment = await commentService
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
    static async getCommentsByPostId(req: Request, res: Response) {
        try {
            const comments = await commentService.findManyByPostId(
                req.params.id as string,
                req.query.sortBy as string,
                Number(req.query.sortDirection),
                Number(req.query.pageNumber),
                Number(req.query.pageSize),
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
}
