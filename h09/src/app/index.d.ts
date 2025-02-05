import {UserDbModel, UserViewModel} from "../models/user/dataModels";
import {ObjectId} from "mongodb";

export type BlogViewModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
};

export type BlogDbModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
};

export type BlogInputModel = {
    name: string,
    description: string,
    websiteUrl: string
};
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
    id: string,
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



export type GetResult = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[] | PostViewModel[] | UserViewModel[] | []
};

export type Error = {
    field: string,
    message: string
};

export type ErrorResult = {
    errorsMessages: Error[]
};

export type CommentInputModel = {
    content: string
};
export type CommentViewModel = {
    content: string,
    id: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string
};

export type CommentatorInfo = {
    userId: ObjectId,
    userLogin: string
};

export type CommentDbModel = {
    content: string,
    id: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string,
    postId: string
};

export type JwtTokenData = {
    userId: ObjectId,
    userLogin: string
}

export type RefreshJwtTokenData = {
    token: string,
    deviceId: string,
    user: JwtTokenData,
    expireAt: string,
    issuedAt: string
}

declare global {
    namespace Express {
        export interface Request {
            user: JwtTokenData,
            refreshToken: string,
            deviceId: string
        }
    }
}


export type ActivityAuditDbModel = {
    ip: string,
    url: string,
    date: Date
}

export type HomeWorkData = {
    reqBody: any,
    reqUrl: string
    reqHeaders: any
    reqMethod: string
    time: Date,
    refreshToken: string | string[],
    parsedRefteshToken: any
<<<<<<< Updated upstream
}
=======
    status: number | undefined
}


export type dbQueryResultForPagination = {
    data: BlogDbModel[] | PostDbModel[] | UserDbModel[] | [],
    totalCount: number
};

export type viewModelResultForPagination = {
    data: BlogViewModel[] | PostViewModel[] | UserViewModel[] | [],
    totalCount: number
};
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
