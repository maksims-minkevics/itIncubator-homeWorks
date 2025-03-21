import {ObjectId} from "mongodb";

export type CommentInputModel = {
    content: string
};
export type CommentViewModel = {
    content: string,
    id: string,
    commentatorInfo: CommentatorInfoModel,
    createdAt: string
};

export type CommentsDbQueryResultForPagination = {
    data: CommentDbModel[] | [],
    totalCount: number
}

export type CommentDbModel = {
    _id: ObjectId,
    content: string,
    commentatorInfo: CommentatorInfoModel,
    createdAt: string,
    postId: string,
};

export type CommentLikeInfo = {
    userId: string,
    status: string,
    commentId: string
}

export type CommentLikesDislikesCount = {
    dislikeCount: number,
    likeCount: number,
    commentId: string
}

export type CommentatorInfoModel = {
    userId: string,
    userLogin: string
};