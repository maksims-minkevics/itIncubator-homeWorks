import {PostViewModel, PostInputModel, GetResult} from "../app/";
import {blogDbHandlerClass} from "./blogs-db-handler";
import {postsCollection} from "../db";
const blogDbHandler = new blogDbHandlerClass();
class postDbHandlerClass {
    async findPostById(id: string): Promise<PostViewModel | null> {
        return await postsCollection.findOne({id: id}, {projection: { _id: 0 } })
    };
    async findPostsByBlogId(
        id: string,
        sortBy: string = "createdAt",
        sortDirection: number = -1,
        pageNumber: number = 1,
        pageSize: number = 10
    ): Promise<GetResult> {
        const DbResult = await postsCollection.aggregate([
            { $match: {blogId: id} },
            {
                $facet: {

                    data: [
                        { $sort: { [sortBy]: sortDirection } },
                        { $skip: (pageNumber - 1) * pageSize },
                        { $limit: pageSize },
                        { $project: { _id: 0 } }
                    ],
                    totalCount: [
                        { $match: {blogId: id} },
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

    };
    async getAllPosts(
        sortBy: string = "createdAt",
        sortDirection: number = -1,
        pageNumber: number = 1,
        pageSize: number = 10): Promise<GetResult> {
        const DbResult = await postsCollection.aggregate([
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
        return {
            pagesCount: Math.ceil(totalDocuments / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: totalDocuments,
            items: DbResult[0].data
        };
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
        await postsCollection.insertOne(newPost);
        return {
            id: newId,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content || "",
            blogId: post.blogId,
            blogName: blogName,
            createdAt: createdAt
        };
    };

    async updatePost(id: string, fieldsToUpdate: PostInputModel): Promise<boolean>{
        return (await postsCollection.updateOne({id:id}, {$set: fieldsToUpdate})).matchedCount !== 0
    }

    async deletePost(id: string): Promise<boolean> {
        return (await postsCollection.deleteOne({id: id})).deletedCount === 1;
    }
    
    async dropDb(){
        await postsCollection.drop();
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
