import {
    CommentatorInfo,
    CommentDbModel,
    CommentInputModel,
    CommentViewModel, GetResult,
} from "../app/";
import {commentCollection} from "../app/db";
import {postDbHandlerClass} from "./posts-db-handler";

const postDbHandler = new postDbHandlerClass();
class commentDbHandlerClass {
    async get(id: string): Promise<CommentViewModel | null>{
        return await commentCollection.findOne(
            {id: id},
            {projection: { _id: 0, postId: 0}}
        );
    };
    async getByPostId(
        id: string,
        sortBy: string = "createdAt",
        sortDirection: number = -1,
        pageNumber: number = 1,
        pageSize: number = 10
    ): Promise<GetResult>
    {
        const DbResult = await commentCollection.aggregate([
            { $match: {postId: id} },
            {

                $facet: {

                    data: [
                        { $sort: { [sortBy]: sortDirection } },
                        { $skip: (pageNumber - 1) * pageSize },
                        { $limit: pageSize },
                        { $project: { _id: 0, postId: 0} }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ]).toArray();
        const totalDocuments = DbResult[0].totalCount[0]?.count || 0;
        return {
            pagesCount: Math.ceil(totalDocuments / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: totalDocuments,
            items: DbResult[0].data
        };

    }
    async delete(id: string, user: CommentatorInfo): Promise<boolean | undefined> {
        const entry = await commentCollection.findOne({id: id});
        if(!entry){
            return undefined
        }

        return (await commentCollection.deleteOne({id: id, "commentatorInfo.userId": user.userId})).deletedCount === 1;
    }

    async update(id: string, comment: CommentInputModel, user: CommentatorInfo): Promise<boolean | undefined> {
        const entry = await commentCollection.findOne({id: id}, { projection: { _id: 0, postId: 0 } });
        if(!entry){
            return undefined
        }
        const result = await commentCollection.updateOne(
            { id: id, "commentatorInfo.userId": user.userId},
            { $set: { content: comment.content } }
        );
        return result.matchedCount != 0
    }

    async create(comment: CommentInputModel, user: CommentatorInfo, postId: string): Promise<CommentViewModel |undefined> {
        const post = await postDbHandler.findPostById(postId);
        if (!post){
            return undefined
        }
        const createdAt = new Date().toISOString();
        const id = (await commentCollection.countDocuments()).toString();
        const newEntry: CommentDbModel ={
            id: id,
            postId: postId,
            content: comment.content,
            createdAt: createdAt,
            commentatorInfo: {
                userId: user.userId,
                userLogin: user.userLogin
            }
        }
        await commentCollection.insertOne(newEntry);

        return {
            id: id,
            content: comment.content,
            createdAt: createdAt,
            commentatorInfo: {
                userId: user.userId,
                userLogin: user.userLogin
            }
        }
    }


    async dropDb(){
        commentCollection.drop();
    }

}
export {commentDbHandlerClass}