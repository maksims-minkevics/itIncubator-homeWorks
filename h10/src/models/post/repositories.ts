import {
    PostInputModel,
    PostDbModel,
    PostsDbQueryResultForPagination,
    PostDbInsertModel
} from "./dataModels";
import {postsCollection} from "../../general/db";
import { ObjectId, DeleteResult, UpdateResult } from "mongodb";

export class PostsRepository {
    async findById(id: string): Promise< PostDbModel | null> {
        try {
            return await postsCollection.findOne({ _id: new ObjectId(id) } );
        } catch (error) {
            console.error("❌ Error in findPostById:", error);
            return null
        }
    }

    async findByBlogId(
        id: string,
        sortBy: string,
        sortDir: number,
        page: number,
        size: number
    ): Promise<PostsDbQueryResultForPagination> {

        const result = await postsCollection.aggregate([
            { $match: {blogId: id} },
            {
                $facet: {

                    data: [
                        { $sort: { [sortBy]: sortDir } },
                        { $skip: (page - 1) * size },
                        { $limit: size }
                    ],
                    totalCount: [
                        { $match: {blogId: id} },
                        { $count: "count" }
                    ]
                }
            }
        ]).toArray();
        const data: PostDbModel[] | [] = result[0].data ?? [];
        const totalCount: number = result[0].totalCount?.[0]?.count || 0;
        return { data: data, totalCount: totalCount };
    }


    async findMany(
        sortBy: string,
        sortDirection: number,
        pageNumber: number,
        pageSize: number
    ): Promise<PostsDbQueryResultForPagination | null> {
        try {
            const result = await postsCollection.aggregate([
                {
                    $facet: {
                        data: [
                            { $sort: { [sortBy]: sortDirection } },
                            { $skip: (pageNumber - 1) * pageSize },
                            { $limit: pageSize },
                        ],
                        totalCount: [{ $count: "count" }]
                    }
                }
            ]).toArray();

            const data: PostDbModel[] | [] = result[0].data ?? [];
            const totalCount: number = result[0].totalCount?.[0]?.count || 0;
            return { data: data, totalCount: totalCount };

        } catch (error) {
            console.error("❌ Error in getPosts:", error);
            return null;
        }
    }

    async create(post: PostDbInsertModel): Promise<PostDbModel> {
        try {

            const result = await postsCollection.insertOne(post as any);
            return { _id: result.insertedId, ...post };
        } catch (error) {
            console.error("❌ Error in createPost:", error);
            throw new Error("Database error while creating post");
        }
    }

    async update(id: string, fieldsToUpdate: Partial<PostInputModel>): Promise<UpdateResult<PostDbModel> | null> {
        try {
            return await postsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: fieldsToUpdate }
            );

        } catch (error) {
            console.error("❌ Error in updatePost:", error);
            return null;
        }
    }

    async delete(id: string): Promise<DeleteResult | null> {
        try {
            return await postsCollection.deleteOne({ _id: new ObjectId(id) });
        } catch (error) {
            console.error("❌ Error in deletePost:", error);
            return null;
        }
    }

    async dropDb(){
        try {
            await postsCollection.drop();
        } catch (error) {
            console.error("Error in dropDb:", error);
            throw new Error("Database error while dropping users collection");
        }
    }
}
