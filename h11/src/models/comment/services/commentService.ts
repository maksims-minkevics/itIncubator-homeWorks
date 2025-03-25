import {CommentsRepository} from "../repositories";
import {GetResult, ServiceResult} from "../../../general";
import {getArrayOfCommentViewModels, getCommentViewModel} from "./commentMapper";
import {CommentatorInfoModel, CommentDbModel, CommentInputModel, CommentViewModel} from "../dataModels";
import {SERVICE_CUSTOM_MSG} from "../../../general/global-consts";
import {paginateResult} from "../../../general/globalServices";
import {ObjectId} from "mongodb";

export class CommentsService{
    constructor(protected commentsRepository: CommentsRepository) {
    }
    async find(id: string, userId: string): Promise<ServiceResult<CommentViewModel>>{
        if (!id){
            return {data: null, status: false}
        }
        if (!ObjectId.isValid(id)){
            return {data: null, status: false}
        }
        const commentLikes = await this.commentsRepository.findOne(id, userId)
        if (!commentLikes){
            return {data: null, status: false}
        }
        const commentViewModel = await getCommentViewModel(commentLikes);
        return {data:  commentViewModel, status: true}
    }

    async update(id: string, commentData: CommentInputModel, userId: string): Promise<ServiceResult<CommentDbModel>>{
        if (!id){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const updatedComment = await this.commentsRepository.update(id, commentData, userId);
        if (!updatedComment){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        if (updatedComment.matchedCount === 0){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.ACCESS_DENIED}
        }
        return {data: null, status: true}
    }

    async create(
        postId: string,
        user: CommentatorInfoModel,
        commentInputData: CommentInputModel
    ): Promise<ServiceResult<CommentViewModel>>{
        if (!postId){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const createdComment = await this.commentsRepository.create(commentInputData, user, postId);
        if (!createdComment){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const commentViewModel = await getCommentViewModel(createdComment)
        return {data:  commentViewModel, status: true}
    }

    async findManyByPostId(
        postId: string,
        sortBy: string,
        sortDir: number,
        page: number,
        size: number,
        userId: string
    ): Promise<ServiceResult<GetResult<CommentViewModel>>>{
        if (!postId){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const comments = await this.commentsRepository.findManyByPostId(postId, sortBy, sortDir, page, size, userId);
        if (!comments){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const arrayOfCommentViewModels = await getArrayOfCommentViewModels(comments.data);
        const paginatedResult = paginateResult(
            {
                totalCount: comments.totalCount,
                data: arrayOfCommentViewModels
            },
            size,
            page
        )
        return {data: paginatedResult, status: true}
    }

    async deleteById(id: string, userId: string): Promise<ServiceResult<CommentDbModel>>{
        if (!id){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const deleteResult = await this.commentsRepository.delete(id, userId);
        if (!deleteResult){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.ACCESS_DENIED}
        }
        if (deleteResult.deletedCount === 0){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.ACCESS_DENIED}
        }

        return {data: null, status: true}
    }

    async updateCommentLikeDislike(commentId: string, status: string, userId: string): Promise<ServiceResult<CommentDbModel>>{
        if (!(commentId && status && userId)){
            return {data: null, status: false}
        }
        const comment = await this.commentsRepository.findOneSimple(commentId);
        if (!comment){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const result = await this.commentsRepository.updateCommentLike(commentId, userId, status);

        if (!result){
            return {data: null, status: false}
        }

        if (result.matchedCount == 0 && result.upsertedCount == 0){
            return {data: null, status: false}
        }

        return {data: null, status: true}
    }

}