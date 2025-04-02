import {CommentsLikesModel, CommentsModel, PostsModel} from "./all-classes";
import {ObjectId} from "mongodb";
import {CommentsSchema} from "../models/comment/schemas";

export const test123 = async () => {
    const postId = "67ebb0c2483293d07b3d7819"
    const userId = "67ebb117b3a9c7ed14c0954a"
    const commentId = "67e2c568f413d67c21693a97"
    const result =await PostsModel.aggregate([
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
                            likes: {
                                $lastN: {
                                    input: "$likesData",
                                    n: 3
                                }
                            }
                        },
                        in: {
                            $cond: [
                                { $gt: [{ $size: "$$likes" }, 0] },
                                "$$likes",
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

    ])
