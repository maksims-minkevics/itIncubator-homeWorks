import {PostDbInsertModel, PostDbModel, PostInputModel, PostViewModel} from "../dataModels";
import {GetResult, ServiceResult} from "../../../general";
import {blogRepository} from "../../blog/repositories";
import {postRepository} from "../repositories";
import {paginateResult} from "../../../general/globalServices";
import {getArrayOfPostsViewModels, getPostViewModel} from "./postMapper";
import {SERVICE_CUSTOM_MSG} from "../../../general/global-consts";
import {blogService} from "../../blog/services/blogService";
import {ObjectId} from "mongodb";

export const postService = {
    async createNew(postData: PostInputModel): Promise<ServiceResult<PostViewModel>> {
        const blogId = postData.blogId;
        if (!blogId) return {status: false, data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        const blog = await blogRepository.findBlogById(blogId);
        if (!blog) return {status: false, data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        const insertDataModel: PostDbInsertModel = {
            title: postData.title,
            shortDescription: postData.shortDescription,
            content: postData.content || "",
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const newPost = await postRepository.create(insertDataModel)
        const postViewModel = await getPostViewModel(newPost)
        return {data: postViewModel, status: true}
    },
    async find(
        sortBy: string,
        sortDir: number,
        page: number,
        size: number
    ): Promise<ServiceResult<GetResult<PostViewModel>>>{
        const posts = await postRepository.findMany(
            sortBy,
            sortDir,
            page,
            size
        )
        if (!posts){
            return {data: null, status: false}
        }
        const arrayOfPostViewModels = await getArrayOfPostsViewModels(posts.data);
        const paginatedResult = paginateResult(
            { totalCount: posts.totalCount, data: arrayOfPostViewModels },
            size,
            page
        )

        return {
            data: paginatedResult,
            status: true
        }
    },

    async findById(id: string): Promise<ServiceResult<PostViewModel>>{
        if (!id){
            return {data: null, status: false}
        }
        const post = await postRepository.findById(id);
        if (!post){
            return {data: null, status: false}
        }

        const postViewModel = await getPostViewModel(post)

        return {data:  postViewModel, status: true}
    },

    async findByBlogId(
        id: string,
        sortBy: string,
        sortDir: number,
        page: number,
        size: number
    ): Promise<ServiceResult<GetResult<PostViewModel>>>{
        if (!id){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const blog = await blogService.findOneById(id);
        if(!blog){
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const post = await postRepository.findByBlogId(id, sortBy, sortDir, page, size);
        const arrayOfPostsViewModels = await getArrayOfPostsViewModels(post.data);
        const paginatedResult = paginateResult(
            { totalCount: post.totalCount, data: arrayOfPostsViewModels },
            size,
            page
        )
        return {data: paginatedResult, status: true
        }
    },

    async deleteById(id: string): Promise<ServiceResult<PostDbModel>>{
        if (!id){
            return {data: null, status: false}
        }

        const isDeleted = await postRepository.delete(id);
        if (!isDeleted){
            return {data: null, status: false}
        }
        if ( isDeleted.deletedCount === 0){
            return {data: null, status: false}
        }

        return {data: null, status: true}
    },

    async updateById(id: string, fieldToUpdate: PostInputModel): Promise<ServiceResult<PostDbModel>>{
        if (!id){
            return {data: null, status: false}
        }
        if (!ObjectId.isValid(fieldToUpdate.blogId)){
            return {status: false, data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        const blog = await blogRepository.findBlogById(fieldToUpdate.blogId);
        if (!blog) return {status: false, data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        const isUpdated = await postRepository.update(id, fieldToUpdate);
        if (!isUpdated){
            return {data: null, status: false}
        }

        if (isUpdated.matchedCount === 0){
            return {data: null, status: false}
        }

        return {data: null, status: true}
    },
}