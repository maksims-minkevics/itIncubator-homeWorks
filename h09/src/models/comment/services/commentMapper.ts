import {CommentDbModel, CommentViewModel} from "../dataModels";

export const getCommentViewModel = async (comment: CommentDbModel): Promise<CommentViewModel | null> => {

    if (!comment) return null;

    return {
            content: comment.content,
            id: comment._id.toString(),
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
    };
}

export const getArrayOfCommentViewModels = async (comments: CommentDbModel[] | []): Promise<CommentViewModel[] | []> => {
    if (Array.isArray(comments)){
        return comments.map(comment => ({
            content: comment.content,
            id: comment._id.toString(),
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }));
    }
    return []
}