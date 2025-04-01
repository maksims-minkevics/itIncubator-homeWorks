import {ObjectId, DeleteResult, UpdateResult} from "mongodb";
import {
    CommentDbModel,
    CommentInputModel,
    CommentatorInfoModel,
    CommentsDbQueryResultForPagination,
    UserCommentLikeInfo, CommentModelWithLikeData
} from "./dataModels";
import {getDbSortDir, getFormattedDate} from "../../general/utilities";
import {CommentsLikesModel, CommentsModel} from "../../general/all-classes";
import {getCommentDbModel} from "./services/commentMapper";

export class CommentsRepository {

    async findOneSimple(id: string): Promise<CommentDbModel | null>{
        try {
            return await CommentsModel.findOne({_id: new ObjectId(id)}).exec();
        }
        catch (error) {
            console.error("❌ Error in findOneSimple:", error);
            return null
        }

    }
    async findOne(id: string, userId: string): Promise<CommentModelWithLikeData | null>{
        try {
            const result = await CommentsModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },

                {
                    $lookup: {
                        from: 'commentslikes',
                        localField: '_id',
                        foreignField: 'commentId',
                        as: 'likesData'
                    }
                },
                {
                    $addFields: {
                        likesCount: {
                            $size: {
                                $filter: {
                                    input: "$likesData",
                                    as: "like",
                                    cond: { $eq: ["$$like.status", "Like"] }
                                }
                            }
                        },
                        dislikesCount: {
                            $size: {
                                $filter: {
                                    input: "$likesData",
                                    as: "like",
                                    cond: { $eq: ["$$like.status", "Dislike"] }
                                }
                            }
                        },
                        myStatus: {
                            $let: {
                                vars: {
                                    user: {
                                        $filter: {
                                            input: "$likesData",
                                            as: "like",
                                            cond: { $eq: ["$$like.userId", userId] }
                                        }
                                    }
                                },
                                in: {
                                    $cond: [
                                        { $gt: [{ $size: "$$user" }, 0] },
                                        { $arrayElemAt: ["$$user.status", 0] },
                                        "None"
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        content: 1,
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 1,
                        createdAt: 1,
                        commentatorInfo: 1
                    }
                }
            ]).exec();
            return result[0]
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
        size: number,
        userId: string
    ): Promise<CommentsDbQueryResultForPagination>{
        try {
            const sortDirSafe=await getDbSortDir(sortDir);
            const data = await CommentsModel.aggregate([
                {
                    $match: {
                        postId: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'commentslikes',
                        localField: '_id',
                        foreignField: 'commentId',
                        as: 'likesData'
                    }
                },
                {
                    $addFields: {
                        likesCount: {
                            $size: {
                                $filter: {
                                    input: "$likesData",
                                    as: "like",
                                    cond: { $eq: ["$$like.status", "Like"] }
                                }
                            }
                        },
                        dislikesCount: {
                            $size: {
                                $filter: {
                                    input: "$likesData",
                                    as: "like",
                                    cond: { $eq: ["$$like.status", "Dislike"] }
                                }
                            }
                        },
                        myStatus: {
                            $let: {
                                vars: {
                                    user: {
                                        $filter: {
                                            input: "$likesData",
                                            as: "like",
                                            cond: { $eq: ["$$like.userId", userId] }
                                        }
                                    }
                                },
                                in: {
                                    $cond: [
                                        { $gt: [{ $size: "$$user" }, 0] },
                                        { $arrayElemAt: ["$$user.status", 0] },
                                        "None"
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        content: 1,
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 1,
                        createdAt: 1,
                        commentatorInfo: 1
                    }
                },
                {
                    $sort: { [sortBy]: sortDirSafe}
                },
                {
                    $skip: (page - 1) * size
                },
                {
                    $limit: size
                }
            ]).exec();
            const totalCount = await CommentsModel.countDocuments({postId: new ObjectId(id)}).exec();
            return { data: data, totalCount: totalCount };
        }
        catch (error) {
            console.error("❌ Error in findManyByPostId:", error);
            return { data: [], totalCount: 0 }
        }
    }

    async delete(id: string, userId: string): Promise<DeleteResult | null>{
        try {
            return await CommentsModel.deleteOne({_id: new ObjectId(id), "commentatorInfo.userId": userId}).lean();
        }
        catch (error) {
            console.error("❌ Error in delete:", error);
            return null
        }
    }

    async update(id: string, commentData: CommentInputModel, userId: string): Promise<UpdateResult<CommentDbModel> | null>{
        try {
            return await CommentsModel.updateOne(
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
                postId: new ObjectId(postId),
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
            await CommentsLikesModel.collection.drop();
        }
        catch (error) {
            console.error("❌ Error in findBlogById:", error);
        }
    }

    async updateCommentLike(id: string, userId: string, status: string): Promise<UpdateResult<UserCommentLikeInfo> | null>{
        try {
            return await CommentsLikesModel.updateOne(
                { commentId: new ObjectId(id), userId: userId},
                { $set: { status: status } },
                {upsert: true}
            ).lean()
        }
        catch (error) {
            console.error("❌ Error in updateCommentLike:", error);
            return null
        }
    }


}