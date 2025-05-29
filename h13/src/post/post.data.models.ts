import {ObjectId} from "mongodb";

export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: PostLikeInfo
};

export type PostDbModel = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
};
export type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
};

export type PostsDbQueryResultForPagination = {
    data: PostModelWithLikeData[] | [],
    totalCount: number
};

export type PostModelWithLikeData = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    dislikesCount: number,
    likesCount: number,
    myStatus: string,
    newestLikes: Array<PostsNewestLikes>

};


export type PostDbInsertModel = {
    _id?: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
};

export type UserPostLikeInfo = {
    userId: string,
    status: string,
    postId: string,
    login: string,
    createdAt: string
}

export type PostLikeInfo = {
    dislikesCount: number,
    likesCount: number,
    myStatus: string,
    newestLikes: Array<PostsNewestLikes>
}

export type PostsNewestLikes = {
    addedAt: string,
    userId: string,
    login: string
}