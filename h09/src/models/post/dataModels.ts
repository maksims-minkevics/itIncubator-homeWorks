import {ObjectId} from "mongodb";

export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
};

export type PostDbModel = {
    _id: ObjectId | string,
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
    data: PostDbModel[] | [],
    totalCount: number
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

export type BlogForPostInputModel = {
    name: string
    id: string
}