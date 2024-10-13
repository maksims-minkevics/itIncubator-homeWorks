import {PostViewModel, PostInputModel, BlogViewModel} from "../object-types";
import {postsDb} from "../dbs/posts-db";
import {blogDbHandlerClass} from "./blogs-db-handler";
import {blogCollection, postsCollection} from "./db";
const blogDbHandler = new blogDbHandlerClass();
class postDbHandlerClass {
    async findPostbyId(id: string): Promise<PostViewModel | null> {
        return await postsCollection.findOne({id: id})
    };
    async getAllPosts(): Promise<PostViewModel[] | null> {
        return await postsCollection.find().toArray()
    };

    async createPost(post: PostViewModel): Promise<PostViewModel>{
        const newPost : any = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content || "",
            blogId: post.blogId,
            blogName: (await blogDbHandler.findBlogbyId(post.blogId))?.name || "",
        }
        const result:any = await postsCollection.insertOne(newPost);
        newPost._id = result._id
        return newPost;
    };

    async updatePost(id: string, fieldsToUpdate: PostInputModel): Promise<boolean>{
        return (await postsCollection.updateOne({id:id}, fieldsToUpdate)).matchedCount !== 0
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
