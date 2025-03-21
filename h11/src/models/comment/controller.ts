import {Request, Response} from "express";
import {HTTP_STATUS, SERVICE_CUSTOM_MSG} from "../../general/global-consts";
import {CommentsService} from "./services/commentService";

export class CommentController {
    constructor(protected commentsService: CommentsService) {
    }
   async getById (req: Request, resp: Response) {
       try {
           const comment = await this.commentsService.find(req.params.id as string)
           if (!comment.status) {
               return resp
                   .sendStatus(HTTP_STATUS.NOT_FOUND);
           }
           return resp
               .status(HTTP_STATUS.OK)
               .json(comment.data);
       } catch (error) {
           console.error("Error in CommentController getById:", error);
           return resp
               .status(HTTP_STATUS.SERVER_ERROR)
               .json({message: "Internal Server Error"});
       }
   };
    async updateById (req: Request, resp: Response){
        const isUpdated = await this.commentsService.update(
        req.params.id as string,
        req.body,
        req.user.userId
    )
        try {
            if(!isUpdated.status && isUpdated.msg === SERVICE_CUSTOM_MSG.NOT_FOUND){
                return resp
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }

            if(!isUpdated.status && isUpdated.msg === SERVICE_CUSTOM_MSG.ACCESS_DENIED){
                return resp
                    .status(HTTP_STATUS.FORBIDEN)
                    .end();
            }

            return resp
                .status(HTTP_STATUS.NO_CONTENT)
                .end();
        } catch (error) {
            console.error("Error in CommentController updateById:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }

    };
    async deleteById (req: Request, resp: Response) {
        try {
            const isDeleted = await this.commentsService.deleteById(
                req.params.id as string,
                req.user.userId);
            if (!isDeleted.status && isDeleted.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
                return resp
                    .status(HTTP_STATUS.NOT_FOUND)
                    .end();
            }

            if (!isDeleted.status && isDeleted.msg === SERVICE_CUSTOM_MSG.ACCESS_DENIED) {
                return resp
                    .status(HTTP_STATUS.FORBIDEN)
                    .end();
            }

            return resp
                .status(HTTP_STATUS.NO_CONTENT)
                .end();
        } catch (error) {
            console.error("Error in CommentController deleteById:", error);
            return resp
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({message: "Internal Server Error"});
        }

    }

    async likeComment(status: string, commentId: string){

    }

}