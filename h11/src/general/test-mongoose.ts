import {CommentsLikesModel, CommentsModel} from "./all-classes";
import {ObjectId} from "mongodb";
import {CommentsSchema} from "../models/comment/schemas";

export const test123 = async () => {
    const postId = "67e2c2fdae85b507472377ef"
    const userId = "67e2c567f413d67c21693a7a"
    const commentId = "67e2c568f413d67c21693a97"
    const result = await CommentsModel.aggregate([
        {
            $match: {
                _id: new ObjectId(commentId)
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
                likeCount: {
                    $size: {
                        $filter: {
                            input: "$likesData",
                            as: "like",
                            cond: { $eq: ["$$like.status", "Like"] }
                        }
                    }
                },
                dislikeCount: {
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
                                "$$user"
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
                likeCount: 1,
                dislikeCount: 1,
                myStatus: 1,
                createdAt: 1,
                commentatorInfo: 1
            }
        }
    ]).exec();
    console.log(result)
}