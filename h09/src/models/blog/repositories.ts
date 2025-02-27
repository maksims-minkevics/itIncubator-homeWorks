import {
    BlogDbInsertModel,
    BlogDbModel,
    BlogDbQueryResultForPagination,
    BlogInputModel
} from "./dataModels";
import {blogCollection} from "../../general/db";
import {ObjectId, UpdateResult, DeleteResult} from "mongodb";

export const blogRepository = {
    async findBlogById(id: string): Promise<BlogDbModel | null> {
        return await blogCollection.findOne({_id: new ObjectId(id)})
    },

    async findMany(searchParam: string, sortBy: string, sortDir: number, page: number, size: number): Promise<BlogDbQueryResultForPagination> {
        const matchStage = searchParam
            ? {name: {$regex: searchParam, $options: "i"}}
            : {};
        const result = await blogCollection.aggregate([
            {$match: matchStage},
            {
                $facet: {
                    data: [
                        {$sort: {[sortBy]: sortDir}},
                        {$skip: (page - 1) * size},
                        {$limit: size},
                    ],
                    totalCount: [
                        {$count: "count"}
                    ]
                }
            }
        ]).toArray();
        const data: BlogDbModel[] | [] = result[0].data || [];
        const totalCount: number = result[0].totalCount?.[0]?.count || 0;
        return {data: data, totalCount: totalCount};
    },

    async delete(id: string): Promise<DeleteResult> {
        try {
            const result = await blogCollection.deleteOne({_id: new ObjectId(id)});
            return result;
        } catch (error) {
            console.error("❌ Error in delete:", error);
            throw new Error("Database error while deleting blog");
        }
    },
    async update(id: string, blogData: BlogInputModel): Promise<UpdateResult<BlogDbModel>> {
        return (await blogCollection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: blogData
            }
        ));
    },

    async create(blog: BlogInputModel): Promise<BlogDbModel | undefined> {
        const newEntry: BlogDbInsertModel = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl || "",
            isMembership: false,
            createdAt: new Date().toISOString()
        };
        const createdBlog = await blogCollection.insertOne(newEntry as any);
        return {
            _id: createdBlog.insertedId,
            ...newEntry
        };

    },
    async dropDb(){
        try {
            await blogCollection.drop();
        } catch (error) {
            console.error("Error in dropDb:", error);
            throw new Error("Database error while dropping users collection");
        }
    }
}