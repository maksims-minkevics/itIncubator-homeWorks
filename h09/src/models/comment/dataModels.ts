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

export type CommentatorInfoModel = {
    userId: string,
    userLogin: string
};

export type CommentDbInsertModel = {
    content: string,
    commentatorInfo: CommentatorInfoModel,
    createdAt: string,
    postId: string
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
    postId: string
};