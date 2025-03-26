import {
    CommentDbModel,
    CommentLikeInfo,
    CommentLikesDislikesCount,
    CommentModelWithLikeData,
    CommentViewModel
} from "../dataModels";
import {IComments, ICommentsLikeInfo} from "../schemas";

export const getCommentViewModel = async (comment: CommentModelWithLikeData | CommentDbModel | null): Promise<CommentViewModel | null> => {
    if (!comment) return null;

    const hasLikesInfo = (
        comment: CommentDbModel | CommentModelWithLikeData
    ): comment is CommentModelWithLikeData => {
        return (
            'likesCount' in comment &&
            'dislikesCount' in comment &&
            'myStatus' in comment
        );
    };
    console.log(comment)

    return {
            content: comment.content,
            id: comment._id.toString(),
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: hasLikesInfo(comment) ? comment.likesCount : 0,
                dislikesCount: hasLikesInfo(comment) ? comment.dislikesCount : 0,
                myStatus: hasLikesInfo(comment) ? comment.myStatus : 'None',
            }
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


export const getArrayOfCommentViewModels = async (comments: CommentModelWithLikeData[] | []): Promise<CommentViewModel[] | []> => {
    if (Array.isArray(comments)){
        return comments.map(comment => ({
            content: comment.content,
            id: comment._id.toString(),
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                dislikesCount: comment.dislikesCount,
                likesCount: comment.likesCount,
                myStatus: comment.myStatus,
            }
        }));
    }
    return []
};