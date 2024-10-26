import {BlogViewModel, BlogInputModel} from "../object-types";
import {blogCollection, postsCollection} from "./db";
import {dbIndexes} from "./db";
class blogDbHandlerClass {

    async findBlogbyId(id?: string): Promise<BlogViewModel | null> {
        return await blogCollection.findOne({id: id},{ projection: { _id: 0 } })
    };
    async getAllBlogs(): Promise<BlogViewModel[] | null> {
        return await blogCollection.find({},{ projection: { _id: 0 } }).toArray()
    };
    async createBlog(blog: BlogInputModel): Promise<BlogViewModel> {
        const createdAt = new Date().toISOString();
        const newId = (await blogCollection.countDocuments() + 1).toString()
        const newBlog:BlogViewModel = {
            id: newId,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl || "",
            isMembership: false,
            createdAt: createdAt
        };
        //dbIndexes.BLOG_INDEX +=1;
        await blogCollection.insertOne(newBlog);
        const result:BlogViewModel = {
            id: newId,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl || "",
            isMembership: false,
            createdAt: createdAt
        };
        return result;
    };
    async updateBlog(id: string, fieldsToUpdate: BlogViewModel): Promise<boolean | null>{
        const updatedBlog = await blogCollection.updateOne(
                                                                        {id:id},{$set:fieldsToUpdate});
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
