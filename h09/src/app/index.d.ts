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

export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
};

export type UserInputModel = {
    login: string,
    password: string,
    email: string
};

export type UserDbModel = {
    id: string,
    login: string,
    password: string,
    email: string,
    createdAt: string
    confirmationCode: string,
    isActivated: boolean,
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
    userId: string,
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
    userId: string,
    userLogin: string
}

export type RefreshJwtTokenData = {
    token: string,
    deviceId: string,
    user: JwtTokenData,
    expireAt: string,
    issuedAt: string
}

export type GeneratedRefreshJwtTokenData = {
    token: string,
    data: RefreshTokenMetaDataDbModel,
}

export type UpdatedRefreshJwtTokenData = {
    token: string,
    refreshToken: string
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

export type userDataValidationResult = {
    _isValidationFailed: boolean,
    data: ErrorResult | {},
    user?: UserDbModel
}

export type ActivityAuditDbModel = {
    ip: string,
    url: string,
    date: Date
}

export type RefreshTokenMetaDataDbModel = {
    ip: string,
    lastActiveDate: string,
    deviceId: string,
    deviceName?: string
    expireAt: string,
    issuedAt: string,
    userId: string
}

export type SessionViewModel = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}