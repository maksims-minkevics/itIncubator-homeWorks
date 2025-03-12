import {userCollection} from "../../general/db";
import {UserDbInsertModel, UserDbModel, UserDbQueryResultForPagination, UserInputModel} from "./dataModels";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";

export class UserRepository {
    async findMany({
                       sortBy = "createdAt",
                       sortDirection = -1,
                       pageNumber = 1,
                       pageSize = 10,
                       searchLoginTerm = "",
                       searchEmailTerm = "",
                   }): Promise<UserDbQueryResultForPagination> {
        try {
            const matchStage = searchLoginTerm || searchEmailTerm
                ? {
                    $or: [
                        {
                            login: {$regex: searchLoginTerm, $options: "i"}
                        },
                        {
                            email: {$regex: searchEmailTerm,$options: "i"}
                        }
                    ]
                }
                : {};

            const result = await userCollection.aggregate([
                {$match: matchStage},
                {
                    $facet: {
                        data: [
                            {$sort: {[sortBy]: sortDirection}},
                            {$skip: (pageNumber - 1) * pageSize},
                            {$limit: pageSize}
                        ],
                        totalCount: [{$count: "count"}],
                    },
                },
            ]).toArray();

            const data: UserDbModel[] | [] = result[0].data || [];
            const totalCount: number = result[0].totalCount?.[0]?.count || 0;

            return {data: data, totalCount: totalCount};
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            throw new Error("Database error while fetching users");
        }
    }

    async findByField(userData: Partial<UserDbModel>): Promise<UserDbModel | null> {
        try {
            return await userCollection.findOne(userData);
        } catch (error) {
            console.error(`Error in getUserByField(${userData}):`, error);
            throw new Error("Database error while fetching user");
        }
    }

    async findByEmailOrLogin(login: string, email: string): Promise<UserDbModel | null> {
        try {
            return await userCollection.findOne(
                {
                    $and: [
                        {
                            $or: [
                                {login}, {email}
                            ]
                        },
                        {isActivated: true}
                    ]
                }
            );
        } catch (error) {
            console.error("Error in getUserByEmailOrLogin:", error);
            throw new Error("Database error while fetching user");
        }
    }

    async create(user: UserInputModel, isActivated = false, confirmationCode = ""): Promise<UserDbModel> {
        try {

            const newUser: UserDbInsertModel = {
                ...user,
                createdAt: new Date().toISOString(),
                confirmationCode: confirmationCode,
                isActivated: isActivated,
            };

            const newObj = await userCollection.insertOne(newUser as any);
            return {
                _id: newObj.insertedId,
                pswrdRecoveryCode: "",
                ...newUser
            };
        } catch (error) {
            console.error("Error in createUser:", error);
            throw new Error("Database error while creating user");
        }
    }

    async delete(id: string): Promise<DeleteResult> {
        try {
            const result = await userCollection.deleteOne({_id: new ObjectId(id)});
            return result;
        } catch (error) {
            console.error("Error in deleteUser:", error);
            throw new Error("Database error while deleting user");
        }
    }

    async dropDb(): Promise<void> {
        try {
            await userCollection.drop();
        } catch (error) {
            console.error("Error in dropDb:", error);
            throw new Error("Database error while dropping users collection");
        }
    }

    async confirmEmail(code: string): Promise<UpdateResult<UserDbModel>> {
        try {
            const result = await userCollection.updateOne(
                {confirmationCode: code, isActivated: false},
                {$set: {isActivated: true}}
            );
            return result;
        } catch (error) {
            console.error("Error in confirmEmail:", error);
            throw new Error("Database error while confirming email");
        }
    }

    async setNewConfirmationCode(code: string, email: string): Promise<UserDbModel | null> {
        try {
            return await userCollection.findOneAndUpdate(
                {email, isActivated: false},
                {$set: {confirmationCode: code}},
                {returnDocument: "after"}
            );
        } catch (error) {
            console.error("Error in setNewConfirmationCode:", error);
            throw new Error("Database error while updating confirmation code");
        }
    }

    async findOne(filter: Partial<UserDbModel>): Promise<UserDbModel | null> {
        try {
            return await userCollection.findOne(filter);
        } catch (error) {
            console.error("Error in findOne:", error);
            throw new Error("Database error while fetching user");
        }
    }

    async updatePassword(newPswrd: string, email: string): Promise <UpdateResult<UserDbModel>>{
        try {
            return await userCollection.updateOne(
                {email: email},
                {$set: {password: newPswrd, pswrdRecoveryCode: ""}}
            );
        } catch (error) {
            console.error("Error in updatePassword:", error);
            throw new Error("Database error while updating password");
        }
    };

    async setRecoveryCode(code: string, email: string): Promise <UpdateResult<UserDbModel>>{
        try {
            return await userCollection.updateOne(
                {email: email},
                {$set: {pswrdRecoveryCode: code}}
            );
        } catch (error) {
            console.error("Error in setRecoveryCode:", error);
            throw new Error("Database error while setting temporary password");
        }
    };
}
