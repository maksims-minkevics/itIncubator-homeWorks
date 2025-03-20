import {
    PostInputModel,
    PostDbModel,
    PostsDbQueryResultForPagination,
    PostDbInsertModel
} from "./dataModels";
import { ObjectId, DeleteResult, UpdateResult } from "mongodb";
import {PostsModel} from "../../general/all-classes";
import {SortOrder} from "mongoose";

export class PostsRepository {
    async findById(id: string): Promise< PostDbModel | null> {
        try {
            return await PostsModel.findById(new ObjectId(id)).lean<PostDbModel>();
        } catch (error) {
            console.error("❌ Error in findById:", error);
            return null
        }
    }

    async findByBlogId(
        id: string,
        sortBy: string,
        sortDir: number,
        page: number,
        size: number
    ): Promise<PostsDbQueryResultForPagination> {
        try {
            const data= await PostsModel.find({blogId: id})
                .sort({[sortBy]:sortDir as SortOrder})
                .skip((page - 1) * size)
                .limit(size)
                .lean<PostDbModel[]>();
            const totalCount = await PostsModel.countDocuments({blogId: id}).exec();
            return { data: data, totalCount: totalCount };
        } catch (error) {
            console.error("❌ Error in findByBlogId:", error);
            return { data: [], totalCount: 0 };
        }
    }

    async findMany(
        sortBy: string,
        sortDir: number,
        page: number,
        size: number
    ): Promise<PostsDbQueryResultForPagination> {
        try {
            const data= await PostsModel.find()
                .sort({[sortBy]:sortDir as SortOrder})
                .skip((page - 1) * size)
                .limit(size)
                .lean<PostDbModel[]>();
            const totalCount = await PostsModel.countDocuments().exec();
            return { data: data, totalCount: totalCount };

        } catch (error) {
            console.error("❌ Error in findMany:", error);
            return { data: [], totalCount: 0 };
        }
    }

    async create(post: PostDbInsertModel): Promise<PostDbModel | null> {
        try {
            const newPost = new PostsModel({
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            });
            await newPost.save()
            return newPost;
        } catch (error) {
            console.error("❌ Error in create:", error);
            return null;
        }
    }

    async update(id: string, fieldsToUpdate: Partial<PostInputModel>): Promise<UpdateResult<PostDbModel> | null> {
        try {
            return PostsModel.updateOne(
                { _id: new ObjectId(id) },
                { $set: fieldsToUpdate }
            ).lean();

        } catch (error) {
            console.error("❌ Error in update:", error);
            return null;
        }
    }

    async delete(id: string): Promise<DeleteResult | null> {
        try {
            return await PostsModel.deleteOne({ _id: new ObjectId(id) }).lean();
        } catch (error) {
            console.error("❌ Error in delete:", error);
            return null;
        }
    }

    async dropDb(){
        try {
            await PostsModel.collection.drop();
        } catch (error) {
            console.error("Error in dropDb:", error);
        }
    }
}
