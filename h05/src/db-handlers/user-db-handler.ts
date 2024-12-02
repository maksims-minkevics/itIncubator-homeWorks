import {GetResult, PostInputModel, PostViewModel, UserDbModel, UserInputModel, UserViewModel} from "../object-types";
import {postsCollection, userCollection} from "./db";
class userDbHandlerClass {
    async getAllUsers({
        sortBy = "createdAt",
        sortDirection = -1,
        pageNumber = 1,
        pageSize = 10,
        searchLoginTerm = "",
        searchEmailTerm = ""
        }): Promise<GetResult> {
        const matchStage = searchLoginTerm || searchEmailTerm
            ? {$or:
                [
                    {
                        login: { $regex: searchLoginTerm, $options: "i"}
                    },
                    {
                        email: { $regex: searchEmailTerm, $options: "i"}
                    }
                ]
            }
            : {};

        const DbResult = await userCollection.aggregate([
            { $match: matchStage },
            {
                $facet: {

                    data: [

                        {$sort: {[sortBy]: sortDirection}},
                        {$skip: (pageNumber - 1) * pageSize},
                        {$limit: pageSize},
                        {$project: {_id: 0, password: 0}}
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

    async getUserByField(fieldName: string, value: string): Promise<UserViewModel | null>{
        const result = await userCollection.findOne({[fieldName]:value}, {projection: { _id: 0 }});
        return result;
    };
    async getUserByEmailLogin(
        login: string,
        email: string,
    ): Promise<UserDbModel | null> {
        const result = await userCollection.findOne(
            {
                $or: [
                    { login: login },
                    { email: email }
                ]
            },
            {
                projection: { _id: 0 }
            }
        );
        return result;
    }
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
                createdAt: createdAt,
                login: user.login,
                email: user.email,
            }
        return result;
    };

    async deleteUser(id: string): Promise<boolean> {
        return (await userCollection.deleteOne({id: id})).deletedCount === 1;
    }

    async dropDb(){
        userCollection.drop();
    }


}
export {userDbHandlerClass}