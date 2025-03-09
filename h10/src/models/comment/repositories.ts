import {commentCollection} from "../../general/db";
import {ObjectId, DeleteResult, UpdateResult} from "mongodb";
import {
    CommentDbInsertModel,
    CommentDbModel,
    CommentInputModel,
    CommentatorInfoModel,
    CommentsDbQueryResultForPagination
} from "./dataModels";
import {getFormattedDate} from "../../general/utilities";

export class CommentsRepository {
    async findOne(id: string): Promise<CommentDbModel | null>{
        return await commentCollection.findOne({_id: new ObjectId(id)})
    }

    async findManyByPostId(
        id: string, 
        sortBy: string,
        sortDir: number,
        page: number,
        size: number
    ): Promise<CommentsDbQueryResultForPagination>{
        const result = await commentCollection.aggregate([
            { $match: {postId: id} },
            {

                $facet: {

                    data: [
                        { $sort: { [sortBy]: sortDir } },
                        { $skip: (page - 1) * size },
                        { $limit: size }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ]).toArray();

        const data: CommentDbModel[] | [] = result[0].data || [];
        const totalCount: number = result[0].totalCount?.[0]?.count || 0;

        return { data: data, totalCount: totalCount };
    }

    async delete(id: string, userId: string): Promise<DeleteResult>{
        return (await commentCollection.deleteOne({_id: new ObjectId(id), "commentatorInfo.userId": userId}))
    }

    async update(id: string, commentData: CommentInputModel, userId: string): Promise<UpdateResult<CommentDbModel>>{
        return (await commentCollection.updateOne(
            { _id: new ObjectId(id), "commentatorInfo.userId": userId},
            { $set: { content: commentData.content } }
        ))
    }

    async create(comment: CommentInputModel, user: CommentatorInfoModel, postId: string): Promise<CommentDbModel> {

        const newEntry: CommentDbInsertModel = {
            postId: postId,
            content: comment.content,
            createdAt: await getFormattedDate(),
            commentatorInfo:
                {
                    userId: user.userId,
                    userLogin: user.userLogin
                }
        }
        const newComment = await commentCollection.insertOne(newEntry as any);
        return {
            _id: newComment.insertedId,
            ...newEntry
        }
    }

    async dropDb(){
        await commentCollection.drop();
    }

}