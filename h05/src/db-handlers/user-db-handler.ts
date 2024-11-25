import {GetResult, PostInputModel, PostViewModel, UserDbModel, UserInputModel, UserViewModel} from "../object-types";
import {postsCollection, userCollection} from "./db";
class UserDbHandlerClass {
    async getAllUsers(
        sortBy: string = "createdAt",
        sortDirection: number = -1,
        pageNumber: number = 1,
        pageSize: number = 10): Promise<GetResult> {
        const DbResult = await userCollection.aggregate([
            {
                $facet: {

                    data: [
                        {$sort: {[sortBy]: sortDirection}},
                        {$skip: (pageNumber - 1) * pageSize},
                        {$limit: pageSize},
                        {$project: {_id: 0}}
                    ],
                    totalCount: [
                        {$count: "count"}
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
    async create(user: UserInputModel): Promise<UserViewModel>{
        const createdAt = new Date().toISOString();
        const newId = (await userCollection.countDocuments() + 1).toString()
        const newrecord : UserDbModel = {
            id: newId,
            createdAt: createdAt,
            password: user.password,
            login: user.login,
            email: user.email,
        }

        await userCollection.insertOne(newrecord);
        const result : UserViewModel = {
            id: newId,
            createdAt: createdAt
            id: newId,
            login: string,
            email: string,
            createdAt: string,
        }
        return result;
    };
}
export {UserDbHandlerClass}