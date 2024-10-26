import {PostViewModel, PostInputModel, BlogViewModel} from "../object-types";
import {blogDbHandlerClass} from "./blogs-db-handler";
import {blogCollection, dbIndexes, postsCollection} from "./db";
const blogDbHandler = new blogDbHandlerClass();
class postDbHandlerClass {
    async findPostbyId(id: string): Promise<PostViewModel | null> {
        return await postsCollection.findOne({id: id}, {projection: { _id: 0 } })
    };
    async getAllPosts(): Promise<PostViewModel[] | null> {
        return await postsCollection.find({}, {projection: { _id: 0 } }).toArray()
    };

    async createPost(post: PostInputModel): Promise<PostViewModel>{
        const createdAt = new Date().toISOString();
        const newId = (await postsCollection.countDocuments() + 1).toString()
        const blogName = (await blogDbHandler.findBlogbyId(post.blogId))?.name || ""
        const newPost : PostViewModel = {
            id: newId,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content || "",
            blogId: post.blogId,
            blogName: blogName,
            createdAt: createdAt
        }
        //dbIndexes.POST_INDEX +=1;
        await postsCollection.insertOne(newPost);
        const result : PostViewModel = {
            id: newId,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content || "",
            blogId: post.blogId,
            blogName: blogName,
            createdAt: createdAt
        }
        return result;
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
