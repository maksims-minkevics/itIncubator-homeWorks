import {PostViewModel, PostInputModel, BlogViewModel} from "../object-types";
import {blogDbHandlerClass} from "./blogs-db-handler";
import {dbIndexes, postsCollection} from "./db";
const blogDbHandler = new blogDbHandlerClass();
class postDbHandlerClass {
    async findPostbyId(id: string): Promise<PostViewModel | null> {
        return await postsCollection.findOne({id: id})
    };
    async getAllPosts(): Promise<PostViewModel[] | null> {
        return await postsCollection.find().toArray()
    };

    async createPost(post: PostInputModel): Promise<PostViewModel>{
        const newPost : PostViewModel = {
            id: dbIndexes.POST_INDEX.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content || "",
            blogId: post.blogId,
            blogName: (await blogDbHandler.findBlogbyId(post.blogId))?.name || "",
            createdAt: new Date().toISOString()
        }
        dbIndexes.POST_INDEX +=1;
        await postsCollection.insertOne(newPost);
        return newPost;
    };

    async updatePost(id: string, fieldsToUpdate: PostInputModel): Promise<boolean>{
        return (await postsCollection.updateOne({id:id}, {$set: fieldsToUpdate})).matchedCount !== 0
    }

    async deletePost(id: string): Promise<boolean> {
        return (await postsCollection.deleteOne({id: id})).deletedCount === 1;
    }
    async dropDb(){
        postsCollection.drop();
    }
    async checkId(blogId: string){
        const blog = await blogDbHandler.findBlogbyId(blogId)
        if(!blog){
            throw new Error('No such blog id');
        }
        return true
    }
}
export {postDbHandlerClass}
