import {BlogViewModel, BlogInputModel, GetResult} from "../object-types";
import {blogCollection} from "./db";
class blogDbHandlerClass {

    async findBlogbyId(id?: string): Promise<BlogViewModel | null> {
        return await blogCollection.findOne({id: id},{ projection: { _id: 0 } })
    };
    async getAllBlogs(
                      searchNameTerm: string = "",
                      sortBy: string = "createdAt",
                      sortDirection: number = -1,
                      pageNumber: number = 1,
                      pageSize: number = 10
    ): Promise<GetResult> {
        const matchStage = searchNameTerm
            ? { name: { $regex: searchNameTerm, $options: "i" } }
            : {};
        console.log(matchStage)
        const DbResult = await blogCollection.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    data: [
                        { $sort: { [sortBy]: sortDirection } },
                        { $skip: (pageNumber - 1) * pageSize },
                        { $limit: pageSize },
                        { $project: { _id: 0 } }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ]).toArray();
        const totalDocuments = DbResult[0].totalCount[0]?.count || 0;
        console.log(DbResult[0])
        return {
            pagesCount: Math.ceil(totalDocuments / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: totalDocuments,
            items: DbResult[0].data
        };
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
