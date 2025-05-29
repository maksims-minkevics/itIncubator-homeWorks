import { BlogDbModel, BlogViewModel } from '../blog.data.models';
import { BlogDocument } from '../schemas/blog.schema';

export const getBlogViewModel = (blog: BlogDbModel): BlogViewModel | null => {
  if (!blog) return null;
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

export const getBlogDbModel = (blog: BlogDocument): BlogDbModel | null => {
  if (!blog) return null;
  return {
    _id: blog._id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

export const getArrayOfBlogViewModels = (
  blogs: BlogDbModel[] | [],
): BlogViewModel[] | [] => {
  if (Array.isArray(blogs)) {
    return blogs.map((blog: BlogDbModel) => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    }));
  }
  return [];
};
