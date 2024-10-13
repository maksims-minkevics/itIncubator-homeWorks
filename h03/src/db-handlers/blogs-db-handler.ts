import {BlogViewModel, BlogError, BlogInputModel} from "../object-types";
import {blogCollection} from "./db";
class blogDbHandlerClass {

    async findBlogbyId(id?: string): Promise<BlogViewModel | null> {
        return await blogCollection.findOne({id: id})
    };
    async getAllBlogs(): Promise<BlogViewModel[] | null> {
        return await blogCollection.find().toArray()
    };
    async createBlog(blog: BlogViewModel): Promise<BlogViewModel | BlogError[]> {
        const result = await blogCollection.insertOne(blog);
        
        return {
            id: result.insertedId.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl || "",
        };
    };
    async updateBlog(id: string, fieldsToUpdate: BlogViewModel): Promise<boolean | null>{
        console.log(id)
        console.log(await blogCollection.findOne({id:id}))
        const updatedBlog = await blogCollection.updateOne(
                                                                        {id:id},{$set:{fieldsToUpdate}});
        return updatedBlog.matchedCount !==0
    };
    async deleteblog(id: string): Promise<boolean> {
        const deletedBlog = await blogCollection.deleteOne({id:id});
        return deletedBlog.deletedCount === 1
    };

    async dropDb(){
        blogCollection.drop();
    }
}
export {blogDbHandlerClass}
