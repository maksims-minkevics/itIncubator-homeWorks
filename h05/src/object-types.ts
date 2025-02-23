export type BlogViewModel = {
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
export type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
};

export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
};

export type UserInputModel = {
    login: string,
    password: string,
    email: string,
};

export type UserDbModel = {
    id: string,
    login: string,
    password: string,
    email: string,
    createdAt: string,
};

export type GetResult = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[] | PostViewModel[] | UserViewModel[] | []
};

export type error = {
    field: string
    message: string
};

export type errorResult = {
    errorsMessages: error[]
};
