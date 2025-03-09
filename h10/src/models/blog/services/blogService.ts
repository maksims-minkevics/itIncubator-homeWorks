import {GetResult, ServiceResult} from "../../../general";
import {getArrayOfBlogViewModels, getBlogViewModel} from "./blogMapper";
import {BlogsRepository} from "../repositories";
import {paginateResult} from "../../../general/globalServices";
import {BlogDbModel, BlogInputModel, BlogViewModel} from "../dataModels";
import {SERVICE_CUSTOM_MSG} from "../../../general/global-consts";

export class BlogsService{
    constructor(protected blogsRepository: BlogsRepository) {
    };

    async findMany(
        searchParam: string,
        sortBy: string,
        sortDir: number,
        page: number,
        size: number
    ): Promise<ServiceResult<GetResult<BlogViewModel>>> {
        const blogs = await this.blogsRepository.findMany(
            searchParam,
            sortBy,
            sortDir,
            page,
            size
        );
        const arrayOfBlogViewModels = await getArrayOfBlogViewModels(blogs.data);
        const paginatedResult = paginateResult(
            {totalCount: blogs.totalCount, data: arrayOfBlogViewModels},
            size,
            page
        );
        return {data: paginatedResult, status: true}
    };

    async findOneById(id: string): Promise<ServiceResult<BlogViewModel>> {
        if (!id) {
            return {data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND, status: false}
        }
        const blog = await this.blogsRepository.findBlogById(id);

        if (!blog) {
            return {data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND, status: false}
        }
        const blogViewModel = await getBlogViewModel(blog);
        return {data: blogViewModel, status: true}
    };

    async deleteOneById(id: string): Promise<ServiceResult<BlogDbModel>> {
        if (!id) {
            return {data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND, status: false}
        }
        const isDeleted = await this.blogsRepository.delete(id);
        if (!isDeleted) {
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        if (isDeleted.deletedCount === 0) {
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        return {data: null, status: true}
    };

    async updateOneById(id: string, blogData: BlogInputModel): Promise<ServiceResult<BlogDbModel>> {
        if (!id) {
            return {data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND, status: false}
        }
        const isUpdated = await this.blogsRepository.update(id, blogData);
        if (!isUpdated) {
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        if (isUpdated.matchedCount === 0) {
            return {data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND}
        }
        return {data: null, status: true}
    };

    async create(blogData: BlogInputModel): Promise<ServiceResult<BlogViewModel>>{
        const blog = await this.blogsRepository.create(blogData);
        if(!blog){
            return {data:null, status: false}
        }
        const blogViewModel = await getBlogViewModel(blog);
        return {data:  blogViewModel, status: true}
    }

}