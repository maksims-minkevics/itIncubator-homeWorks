import {UserDbModel, UserViewModel} from "../dataModels";

export const getUserViewModel = async (user: UserDbModel): Promise<UserViewModel | undefined> => {

    if (!user) return undefined;

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