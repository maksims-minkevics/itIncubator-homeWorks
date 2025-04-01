import {
    BlogDbModel,
    BlogDbQueryResultForPagination,
    BlogInputModel
} from "./dataModels";
import {ObjectId, UpdateResult, DeleteResult} from "mongodb";
import {BlogsModel} from "../../general/all-classes";
import {SortOrder} from "mongoose";
import {getFormattedDate} from "../../general/utilities";
import {getBlogDbModel} from "./services/blogMapper";

export class BlogsRepository{
    async findBlogById(id: string): Promise<BlogDbModel | null> {
        try {
            return BlogsModel.findOne({_id: new ObjectId(id)}).lean<BlogDbModel>();
        } catch (error) {
            console.error("❌ Error in findBlogById:", error);
            return null
        }
    }

    async findMany(searchParam: string, sortBy: string, sortDir: number, page: number, size: number): Promise<BlogDbQueryResultForPagination> {
        try {
            let query = {}
            if (searchParam){
                query = {name: {$regex: searchParam, $options: "i"}}
            }
            const data = await BlogsModel.find(query)
                .sort({ [sortBy]: sortDir as SortOrder })
                .skip((page - 1) * size)
                .limit(size)
                .lean<BlogDbModel[]>();
            const totalCount= await BlogsModel.countDocuments().exec();
            return {data: data, totalCount: totalCount};
        } catch (error) {
            console.error("❌ Error in findMany:", error);
            return {data: [], totalCount: 0}
        }
    }

    async delete(id: string): Promise<DeleteResult | null> {
        try {
            return  await BlogsModel.deleteOne({_id: new ObjectId(id)}).lean();
        } catch (error) {
            console.error("❌ Error in delete:", error);
            return null
        }
    }
    async update(id: string, blogData: BlogInputModel): Promise<UpdateResult<BlogDbModel> | null> {
        try {
            return BlogsModel.updateOne({_id: new ObjectId(id)},{$set: blogData});
        } catch (error) {
            console.error("❌ Error in update:", error);
            return null
        }
    }

    async create(blog: BlogInputModel): Promise<BlogDbModel | null> {
        try {
            const newEntry = new BlogsModel({
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                isMembership: false,
                createdAt: await getFormattedDate()
            });
            await newEntry.save()
            return await getBlogDbModel(newEntry)
        } catch (error) {
            console.error("❌ Error in create:", error);
            return null
        }
    }

    async dropDb(){
        try {
            await BlogsModel.collection.drop();
        } catch (error) {
            console.error("❌ Error in dropDb:", error);
        }
    }
}