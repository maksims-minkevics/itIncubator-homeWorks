import {UserDbModel, UserViewModel} from "../dataModels";
import {IUsers} from "../schemas";
import {ObjectId} from "mongodb";

export const getUserViewModel = async (user: UserDbModel | null): Promise<UserViewModel | null> => {

    if (!user) return null;

    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    };
}

export const getArrayOfUsersViewModels = async (users: UserDbModel[] | []): Promise<UserViewModel[] | []> => {
    if (Array.isArray(users)){
        return users.map(user => ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }));
    }
    return []
}

export const getUsersDbModel = async (user: IUsers | null): Promise<UserDbModel | null> => {
    if (!user) return null;

    return {
        _id: user._id,
        login: user.login,
        password: user.password,
        email: user.email,
        createdAt: user.createdAt,
        confirmationCode: user.confirmationCode as string,
        isActivated: user.isActivated,
        pswrdRecoveryCode: user.pswrdRecoveryCode
    };
}

export const getArrayOfUsersDbModel = async (users: IUsers[] | null): Promise<UserDbModel[] | []> => {
    if (Array.isArray(users)){
        return users.map(user => ({
            _id: user._id,
            login: user.login,
            password: user.password,
            email: user.email,
            createdAt: user.createdAt,
            confirmationCode: user.confirmationCode as string,
            isActivated: user.isActivated,
            pswrdRecoveryCode: user.pswrdRecoveryCode
        } as UserDbModel))
    };

    return []
}