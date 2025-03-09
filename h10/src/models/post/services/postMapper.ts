import {PostDbModel, PostViewModel} from "../dataModels";

export const getPostViewModel = async (post: PostDbModel | null): Promise<PostViewModel | undefined> => {
    if (!post) return undefined;
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const getArrayOfPostsViewModels = async (posts: PostDbModel[] | []): Promise<PostViewModel[] | []> => {
    if (Array.isArray(posts)){
        return posts.map(post => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }));
    }
    return []
}