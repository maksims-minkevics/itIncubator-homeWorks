import {BlogDbModel, BlogViewModel} from "../dataModels";
import {IBlogs} from "../schemas";

export const getBlogViewModel = async (blog: BlogDbModel): Promise<BlogViewModel | null> => {
    if (!blog) return null;
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
}

export const getBlogDbModel = async (blog: IBlogs): Promise<BlogDbModel | null> => {
    if (!blog) return null;
    return {
        _id: blog._id,
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