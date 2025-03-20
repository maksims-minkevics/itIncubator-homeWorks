import {UserDbModel, UserDbQueryResultForPagination, UserInputModel} from "./dataModels";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {UsersModel} from "../../general/all-classes";
import { QueryOptions, SortOrder } from "mongoose";
import {getUsersDbModel} from "./services/userMapper";

export class UserRepository {

    async findMany({
                 sortBy = "createdAt",
                 sortDir = -1,
                 page = 1,
                 size = 10,
                 searchLoginTerm = "",
                 searchEmailTerm = "",
             }): Promise<UserDbQueryResultForPagination> {
        try {
            const query: any = {};
            const orConditions = [];

            if (searchLoginTerm.trim()) {
                orConditions.push({ login: { $regex: searchLoginTerm, $options: "i" } });
            }

            if (searchEmailTerm.trim()) {
                orConditions.push({ email: { $regex: searchEmailTerm, $options: "i" } });
            }

            if (orConditions.length > 0) {
                query.$or = orConditions;
            }
            const users= await UsersModel.find(query)
                .sort({ [sortBy]: sortDir as SortOrder })
                .skip((page - 1) * size)
                .limit(size)
                .lean<UserDbModel[]>();
            const totalCount =  await UsersModel.countDocuments(query).exec();
            return {data: users, totalCount};
        } catch (error) {
            console.error("❌ Error in findMany:", error);
            throw new Error("Database error while fetching users");
        }
    }

    async findByField(filter: Partial<UserDbModel>): Promise<UserDbModel | null> {
        try {
            const result = await UsersModel.findOne(filter).lean<UserDbModel>();
            return result
        } catch (error) {
            console.error(`Error in getUserByField(${filter}):`, error);
            throw new Error("Database error while fetching user");
        }
    }
    async findByEmailOrLogin(login: string, email: string): Promise<UserDbModel | null> {
        try {
            return await UsersModel.findOne({ $or: [{ login }, { email }], isActivated: true }).lean<UserDbModel>();
        } catch (error) {
            console.error("Error in getUserByEmailOrLogin:", error);
            throw new Error("Database error while fetching user");
        }
    }
    async create(userInput: UserInputModel, isActivated = false, confirmationCode = ""): Promise<UserDbModel | null> {
        try {
            const newUser = new UsersModel({
                login: userInput.login,
                password: userInput.password,
                email: userInput.email,
                confirmationCode: confirmationCode,
                isActivated: isActivated,
            });
            await newUser
                .save();
            return await getUsersDbModel(newUser)
        } catch (error) {
            console.error("Error in createUser:", error);
            throw new Error("Database error while creating user");
        }
    }

    async delete(id: string): Promise<DeleteResult> {
        try {
            const result = await UsersModel.deleteOne({_id: new ObjectId(id)}, {lean: true});
            return result;
        } catch (error) {
            console.error("Error in deleteUser:", error);
            throw new Error("Database error while deleting user");
        }
    }

    async dropDb(): Promise<void> {
        try {
            await UsersModel.collection.drop();
        } catch (error) {
            console.error("Error in dropDb:", error);
            throw new Error("Database error while dropping users collection");
        }
    }

    async confirmEmail(code: string): Promise<UpdateResult<UserDbModel>> {
        try {
            const result = await UsersModel.updateOne(
                { confirmationCode: code, isActivated: false },
                { $set: { isActivated: true } }
            ).lean();
            return result;
        } catch (error) {
            console.error("Error in confirmEmail:", error);
            throw new Error("Database error while confirming email");
        }
    }

    async setNewConfirmationCode(code: string, email: string): Promise<UserDbModel | null> {
        try {
            return await UsersModel.findOneAndUpdate(
                {email, isActivated: false},
                {$set: {confirmationCode: code}},
            )
                .lean<UserDbModel>();
        } catch (error) {
            console.error("Error in setNewConfirmationCode:", error);
            throw new Error("Database error while updating confirmation code");
        }
    }

    async findOne(filter: Partial<UserDbModel>): Promise<UserDbModel | null> {
        try {
            return await UsersModel.findOne(filter, null, {lean:true}).lean<UserDbModel>();
        } catch (error) {
            console.error("Error in findOne:", error);
            throw new Error("Database error while fetching user");
        }
    }

    async updatePassword(newPswrd: string, email: string): Promise <UpdateResult<UserDbModel>>{
        try {
            const options: QueryOptions = { new: true, returnDocument: "after" };
            return await UsersModel.updateOne(
                {email: email},
                {$set: {password: newPswrd, pswrdRecoveryCode: ""}}
            )
                .lean();
        } catch (error) {
            console.error("Error in updatePassword:", error);
            throw new Error("Database error while updating password");
        }
    };

    async setRecoveryCode(code: string, email: string): Promise <UpdateResult<UserDbModel>>{
        try {
            return await UsersModel.updateOne(
                {email: email},
                {$set: {pswrdRecoveryCode: code}}
            )
                .lean();
        } catch (error) {
            console.error("Error in setRecoveryCode:", error);
            throw new Error("Database error while setting temporary password");
        }
    };
}
