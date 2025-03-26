import {ObjectId} from "mongodb";

export type CommentInputModel = {
    content: string
};
export type CommentViewModel = {
    content: string,
    id: string,
    commentatorInfo: CommentatorInfoModel,
    createdAt: string,
    likesInfo: CommentLikeInfo
};

export type UserCommentLikeInfo = {
    userId: string,
    status: string,
    commentId: string
}

export type CommentLikeInfo = {
    dislikesCount: number,
    likesCount: number,
    myStatus: string
}

export type CommentsDbQueryResultForPagination = {
    data: CommentModelWithLikeData[] | [],
    totalCount: number
}

export type CommentDbModel = {
    _id: ObjectId,
    content: string,
    commentatorInfo: CommentatorInfoModel,
    createdAt: string,
    postId: ObjectId,
};

export type CommentModelWithLikeData = {
    _id: ObjectId,
    content: string,
    commentatorInfo: CommentatorInfoModel,
    createdAt: string,
    dislikesCount: number,
    likesCount: number,
    myStatus: string
};

export type CommentLikesDislikesCount = {
    dislikesCount: number,
    likesCount: number,
    commentId: string
}

export type CommentatorInfoModel = {
    userId: string,
    userLogin: string
};