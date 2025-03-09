import {CommentsRepository} from "../repositories";
import {GetResult, ServiceResult} from "../../../general";
import {getArrayOfCommentViewModels, getCommentViewModel} from "./commentMapper";
import {CommentatorInfoModel, CommentDbModel, CommentInputModel, CommentViewModel} from "../dataModels";
import {SERVICE_CUSTOM_MSG} from "../../../general/global-consts";
import {paginateResult} from "../../../general/globalServices";

export class CommentsService{
    constructor(protected commentsRepository: CommentsRepository) {
    }
    async find(id: string): Promise<ServiceResult<CommentViewModel>>{
        if (!id){
            return {data: null, status: false}
        }
        const comment = await this.commentsRepository.findOne(id);
        if (!comment){
            return {data: null, status: false}
        }
        const commentViewModel = await getCommentViewModel(comment);
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
        size: number
    ): Promise<ServiceResult<GetResult<CommentViewModel>>>{
        if (!postId){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const comments = await this.commentsRepository.findManyByPostId(postId, sortBy, sortDir, page, size);
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

    async deleteById(postId: string, userId: string): Promise<ServiceResult<CommentDbModel>>{
        if (!postId){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const deleteResult = await this.commentsRepository.delete(postId, userId);
        if (!deleteResult){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.ACCESS_DENIED}
        }
        if (deleteResult.deletedCount === 0){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.ACCESS_DENIED}
        }

        return {data: null, status: true}
    }

}