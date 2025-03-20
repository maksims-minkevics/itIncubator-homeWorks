import {ObjectId, DeleteResult, UpdateResult} from "mongodb";
import {
    CommentDbModel,
    CommentInputModel,
    CommentatorInfoModel,
    CommentsDbQueryResultForPagination
} from "./dataModels";
import {getFormattedDate} from "../../general/utilities";
import {CommentsModel} from "../../general/all-classes";
import {SortOrder} from "mongoose";
import {getCommentDbModel} from "./services/commentMapper";

export class CommentsRepository {
    async findOne(id: string): Promise<CommentDbModel | null>{
        try {
            return CommentsModel.findOne({_id: new ObjectId(id)}).lean<CommentDbModel>();
        }
        catch (error) {
            console.error("❌ Error in findOne:", error);
            return null
        }
    }

    async findManyByPostId(
        id: string, 
        sortBy: string,
        sortDir: number,
        page: number,
        size: number
    ): Promise<CommentsDbQueryResultForPagination>{
        try {
            const data = await CommentsModel.find({postId: id})
                .sort({ [sortBy]: sortDir as SortOrder})
                .skip((page - 1) * size)
                .limit(size)
                .lean<CommentDbModel[]>();
            const totalCount = await CommentsModel.countDocuments().exec();
            return { data: data, totalCount: totalCount };
        }
        catch (error) {
            console.error("❌ Error in findManyByPostId:", error);
            return { data: [], totalCount: 0 }
        }
    }

    async delete(id: string, userId: string): Promise<DeleteResult | null>{
        try {
            return CommentsModel.deleteOne({_id: new ObjectId(id), "commentatorInfo.userId": userId}).lean();
        }
        catch (error) {
            console.error("❌ Error in delete:", error);
            return null
        }
    }

    async update(id: string, commentData: CommentInputModel, userId: string): Promise<UpdateResult<CommentDbModel> | null>{
        try {
            return CommentsModel.updateOne(
                { _id: new ObjectId(id), "commentatorInfo.userId": userId},
                { $set: { content: commentData.content } }
            ).lean()
        }
        catch (error) {
            console.error("❌ Error in update:", error);
            return null
        }
    }

    async create(comment: CommentInputModel, user: CommentatorInfoModel, postId: string): Promise<CommentDbModel | null> {
        try {
            const newEntry = new CommentsModel({
                postId: postId,
                content: comment.content,
                createdAt: await getFormattedDate(),
                commentatorInfo:
                    {
                        userId: user.userId,
                        userLogin: user.userLogin
                    }
            })
            await newEntry.save();
            return await getCommentDbModel(newEntry);
        }
        catch (error) {
            console.error("❌ Error in create:", error);
            return null
        }
    }

    async dropDb(){
        try {
            await CommentsModel.collection.drop();
        }
        catch (error) {
            console.error("❌ Error in findBlogById:", error);
        }
    }
}