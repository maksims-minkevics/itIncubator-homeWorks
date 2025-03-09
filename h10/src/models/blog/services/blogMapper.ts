import {BlogDbModel, BlogViewModel} from "../dataModels";

export const getBlogViewModel = async (blog: BlogDbModel): Promise<BlogViewModel | undefined> => {

    if (!blog) return undefined;

    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
}

export const getArrayOfBlogViewModels = async (blogs: BlogDbModel[] | []): Promise<BlogViewModel[] | []> => {
    if (Array.isArray(blogs)){
        return blogs.map(blog => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }));
    }
    return []
}