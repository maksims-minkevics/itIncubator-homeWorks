import {
    CommentatorInfo,
    CommentDbModel,
    CommentInputModel,
    CommentViewModel,
    GetResult,
    UserDbModel,
    UserInputModel,
    UserViewModel
} from "../app/";
import {commentCollection} from "../app/db";
class commentDbHandlerClass {
    async get(id: string): Promise<CommentViewModel | null>{
        return await commentCollection.findOne(
            {id: id},
            {projection: { _id: 0 }}
        );
    };

    async delete(id: string): Promise<boolean> {
        return (await commentCollection.deleteOne({id: id})).deletedCount === 1;
    }

    async update(id: string, comment: CommentInputModel): Promise<boolean> {
        const result = await commentCollection.updateOne(
            { id: id },
            { $set: { content: comment.content } }
        );
        return result.matchedCount != 0
    }

    async create(comment: CommentInputModel, user: CommentatorInfo): Promise<CommentViewModel> {
        const createdAt = new Date().toISOString();
        const id = (await commentCollection.countDocuments()).toString();
        const newEntry: CommentDbModel ={
            id: id,
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