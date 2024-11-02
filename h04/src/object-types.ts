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

export type GetResult = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[] | PostViewModel[] | []
};
