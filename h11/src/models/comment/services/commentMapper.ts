import {CommentDbModel, CommentViewModel} from "../dataModels";
import {IComments} from "../schemas";

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
};

export const getCommentDbModel = async (comment: IComments): Promise<CommentDbModel | null> => {
    if (!comment) return null;
    return {
        content: comment.content,
        _id: comment._id,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        postId: comment.postId
    };
};


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
};