import {
    PostInputModel,
    PostDbModel,
    PostsDbQueryResultForPagination,
    PostDbInsertModel, UserPostLikeInfo, PostModelWithLikeData
} from "./dataModels";
import { ObjectId, DeleteResult, UpdateResult } from "mongodb";
import {PostsModel, PostsLikesModel} from "../../general/all-classes";
import {getDbSortDir} from "../../general/utilities";

export class PostsRepository {
    async findById(id: string, userId: string): Promise< PostModelWithLikeData | null> {
        try {
            const data= await PostsModel.aggregate([
                {
                    $match: {_id: new ObjectId(id)}
                },
                {
                    $lookup: {
                        from: 'postslikes',
                        localField: '_id',
                        foreignField: 'postId',
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
                        },
                        newestLikes: {
                            $let: {
                                vars: {
                                    filteredLikes: {
                                        $filter: {
                                            input: "$likesData",
                                            as: "like",
                                            cond: { $eq: ["$$like.status", "Like"] }
                                        }
                                    },
                                    sortedLikes: {
                                        $sortArray: {
                                            input: {
                                                $filter: {
                                                    input: "$likesData",
                                                    as: "like",
                                                    cond: { $eq: ["$$like.status", "Like"] }
                                                }
                                            },
                                            sortBy: { addedAt: -1 }
                                        }
                                    }
                                },
                                in: {
                                    $cond: [
                                        { $gt: [{ $size: "$$sortedLikes" }, 0] },
                                        {
                                            $map: {
                                                input: {
                                                    $slice: ["$$sortedLikes", 0, 3]
                                                },
                                                as: "likeData",
                                                in: {
                                                    userId: "$$likeData.userId",
                                                    addedAt: "$$likeData.addedAt",
                                                    login: "$$likeData.login"
                                                }
                                            }
                                        },
                                        []
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        shortDescription: 1,
                        content: 1,
                        blogId: 1,
                        blogName: 1,
                        createdAt: 1,
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 1,
                        newestLikes: 1
                    }
                }
            ]).exec();
            return data[0]
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
        size: number,
        userId: string
    ): Promise<PostsDbQueryResultForPagination> {
        try {
            const sortDirSafe=await getDbSortDir(sortDir);
            const data= await PostsModel.aggregate([
                {
                    $match: {blogId: id}
                },
                {
                    $lookup: {
                        from: 'postslikes',
                        localField: '_id',
                        foreignField: 'postId',
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
                        },
                        newestLikes: {
                            $let: {
                                vars: {
                                    filteredLikes: {
                                        $filter: {
                                            input: "$likesData",
                                            as: "like",
                                            cond: { $eq: ["$$like.status", "Like"] }
                                        }
                                    },
                                    sortedLikes: {
                                        $sortArray: {
                                            input: {
                                                $filter: {
                                                    input: "$likesData",
                                                    as: "like",
                                                    cond: { $eq: ["$$like.status", "Like"] }
                                                }
                                            },
                                            sortBy: { addedAt: -1 }
                                        }
                                    }
                                },
                                in: {
                                    $cond: [
                                        { $gt: [{ $size: "$$sortedLikes" }, 0] },
                                        {
                                            $map: {
                                                input: {
                                                    $slice: ["$$sortedLikes", 0, 3]
                                                },
                                                as: "likeData",
                                                in: {
                                                    userId: "$$likeData.userId",
                                                    addedAt: "$$likeData.addedAt",
                                                    login: "$$likeData.login"
                                                }
                                            }
                                        },
                                        []
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        shortDescription: 1,
                        content: 1,
                        blogId: 1,
                        blogName: 1,
                        createdAt: 1,
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 1,
                        newestLikes: 1
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
        size: number,
        userId: string
    ): Promise<PostsDbQueryResultForPagination> {
        try {
            const sortDirSafe=await getDbSortDir(sortDir);
            const data= await PostsModel.aggregate([
                {
                    $lookup: {
                        from: 'postslikes',
                        localField: '_id',
                        foreignField: 'postId',
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
                        },
                        newestLikes: {
                            $let: {
                                vars: {
                                    filteredLikes: {
                                        $filter: {
                                            input: "$likesData",
                                            as: "like",
                                            cond: { $eq: ["$$like.status", "Like"] }
                                        }
                                    },
                                    sortedLikes: {
                                        $sortArray: {
                                            input: {
                                                $filter: {
                                                    input: "$likesData",
                                                    as: "like",
                                                    cond: { $eq: ["$$like.status", "Like"] }
                                                }
                                            },
                                            sortBy: { addedAt: -1 }
                                        }
                                    }
                                },
                                in: {
                                    $cond: [
                                        { $gt: [{ $size: "$$sortedLikes" }, 0] },
                                        {
                                            $map: {
                                                input: {
                                                    $slice: ["$$sortedLikes", 0, 3]
                                                },
                                                as: "likeData",
                                                in: {
                                                    userId: "$$likeData.userId",
                                                    addedAt: "$$likeData.addedAt",
                                                    login: "$$likeData.login"
                                                }
                                            }
                                        },
                                        []
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        shortDescription: 1,
                        content: 1,
                        blogId: 1,
                        blogName: 1,
                        createdAt: 1,
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 1,
                        newestLikes: 1
                    }
                },{
                    $sort: { [sortBy]: sortDirSafe}
                },
                {
                    $skip: (page - 1) * size
                },
                {
                    $limit: size
                }
            ]).exec();

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
            await PostsLikesModel.collection.drop();
        } catch (error) {
            console.error("Error in dropDb:", error);
        }
    }

    async findOneSimple(id: string): Promise<PostDbModel | null>{
        try {
            return await PostsModel.findById(new ObjectId(id)).exec();
        }
        catch (error) {
            console.error("❌ Error in findOneSimple:", error);
            return null
        }

    }

    async likePost(id: string, status: string, userId: string, userLogin: string): Promise<UpdateResult<UserPostLikeInfo> | null>{
        try {
            return await PostsLikesModel.updateOne(
                { postId: new ObjectId(id), userId: userId},
                { $set: { status: status, addedAt: new Date().toISOString(), login: userLogin} },
                {upsert: true}
            ).lean()
        }
        catch (error) {
            console.error("❌ Error in likePost:", error);
            return null
        }
    }
}
