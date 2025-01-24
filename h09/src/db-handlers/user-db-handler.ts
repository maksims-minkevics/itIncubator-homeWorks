import { GetResult, UserDbModel, UserInputModel } from "../app/";
import {userCollection} from "../app/db";
class userDbHandlerClass {
    async getAllUsers({
                          sortBy = "createdAt",
                          sortDirection = -1,
                          pageNumber = 1,
                          pageSize = 10,
                          searchLoginTerm = "",
                          searchEmailTerm = "",
                      }): Promise<GetResult> {
        const matchStage =
            searchLoginTerm || searchEmailTerm
                ? {
                    $or: [
                        {
                            login: { $regex: searchLoginTerm, $options: "i" },
                        },
                        {
                            email: { $regex: searchEmailTerm, $options: "i" },
                        },
                    ],
                }
                : {};

        const dbResult = await userCollection
            .aggregate([
                { $match: matchStage },
                {
                    $facet: {
                        data: [
                            { $sort: { [sortBy]: sortDirection } },
                            { $skip: (pageNumber - 1) * pageSize },
                            { $limit: pageSize },
                            { $project: { _id: 0, password: 0, refreshToken: 0 } },
                        ],
                        totalCount: [{ $count: "count" }],
                    },
                },
            ])
            .toArray();
        const totalDocuments = dbResult[0].totalCount[0]?.count || 0;
        return {
            pagesCount: Math.ceil(totalDocuments / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: totalDocuments,
            items: dbResult[0].data,
        };
    }

    async getUserByField(
        fieldName: string,
        value: string
    ): Promise<UserDbModel | null> {
        const result = await userCollection.findOne(
            { [fieldName]: value },
            { projection: { _id: 0, refreshToken: 0} }
        );
        return result;
    };

    async getUserByEmailLogin(login: string, email: string): Promise<UserDbModel | null> {
        const result = await userCollection.findOne(
            {
                $and: [
                    {
                        $or: [{ login: login }, { email: email }],
                    },
                    { isActivated: true },
                ],
            },
            {
                projection: { _id: 0, refreshToken: 0 },
            }
        );
        return result;
    }
    async create(
        user: UserInputModel,
        isActivated: boolean = false,
        confirmationCode: string = ""
    ): Promise<UserDbModel> {
        const createdAt = new Date().toISOString();
        const newId = ((await userCollection.countDocuments()) + 1).toString();
        const newrecord: UserDbModel = {
            id: newId,
            createdAt: createdAt,
            password: user.password,
            login: user.login,
            email: user.email,
            confirmationCode: confirmationCode,
            isActivated: isActivated,
        };

        await userCollection.insertOne(newrecord);
        return newrecord;
    }

    async deleteUser(id: string): Promise<boolean> {
        return (await userCollection.deleteOne({ id: id })).deletedCount === 1;
    }

    async dropDb() {
        await userCollection.drop();
    }

    async checkAndConfirmEmail(code: string): Promise<boolean>{
        return (await userCollection.updateOne({confirmationCode: code, isActivated: false}, {$set: {isActivated: true}})).matchedCount !== 0
    }

    async updateUserConfirmationCode(code:string, email: string){

        return (await userCollection.findOneAndUpdate({email: email, isActivated: false}, {$set: {confirmationCode: code}}, {returnDocument: "after"}))
    }

    async getUser(filter: Partial<UserDbModel>): Promise<UserDbModel | null> {
        return await userCollection.findOne(filter);
    }

}
export { userDbHandlerClass };
