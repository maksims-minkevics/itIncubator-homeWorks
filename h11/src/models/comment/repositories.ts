import {ObjectId, DeleteResult, UpdateResult} from "mongodb";
import {
    CommentDbModel,
    CommentInputModel,
    CommentatorInfoModel,
    CommentsDbQueryResultForPagination,
    CommentLikeInfo, CommentLikesDislikesCount
} from "./dataModels";
import {getFormattedDate} from "../../general/utilities";
import {CommentsLikesModel, CommentsModel} from "../../general/all-classes";
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

    async updateCommentLike(id: string, userId: string, status: string): Promise<UpdateResult<CommentLikeInfo> | null>{
        try {
            return CommentsLikesModel.updateOne(
                { commentId: id, userId: userId},
                { $set: { status: status } },
                {upsert: true}
            ).lean()
        }
        catch (error) {
            console.error("❌ Error in updateCommentLike:", error);
            return null
        }
    }

    async getLikesDislikes(id: string): Promise<CommentLikesDislikesCount>{
        try {
            const result = await CommentsLikesModel.aggregate([
                {
                    $match: { commentId: id }
                },
                {
                    $group: {
                        _id: { commentId: "$commentId", status: "$status" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: "$_id.commentId",
                        likeCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.status", "Like"] }, "$count", 0]
                            }
                        },
                        dislikeCount: {
                            $sum: {
                                $cond: [{ $eq: ["$_id.status", "Dislike"] }, "$count", 0]
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        commentId: "$_id",
                        likeCount: 1,
                        dislikeCount: 1
                    }
                }
            ]).exec();
            return result[0]
        }
        catch (error) {
            console.error("❌ Error in getLikesDislikes:", error);
            return {dislikeCount: 0, likeCount: 0, commentId: ""}
        }
    }

}