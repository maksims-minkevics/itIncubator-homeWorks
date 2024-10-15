import {BlogViewModel, BlogInputModel} from "../object-types";
import {blogCollection, postsCollection} from "./db";
import {dbIndexes} from "./db";
class blogDbHandlerClass {

    async findBlogbyId(id?: string): Promise<BlogViewModel | null> {
        return await blogCollection.findOne({id: id})
    };
    async getAllBlogs(): Promise<BlogViewModel[] | null> {
        return await blogCollection.find().toArray()
    };
    async createBlog(blog: BlogInputModel): Promise<BlogViewModel> {

        const newBlog:BlogViewModel = {
            id: (await blogCollection.countDocuments() + 1).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl || "",
            isMembership: false,
            createdAt: new Date().toISOString()
        };
        //dbIndexes.BLOG_INDEX +=1;
        const result = await blogCollection.insertOne(newBlog);
        return newBlog;
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
