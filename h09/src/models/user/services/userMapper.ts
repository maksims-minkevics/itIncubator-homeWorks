import {UserDbModel, UserViewModel} from "../dataModels";

export const getUserViewModel = async (user: UserDbModel): Promise<UserViewModel | {}> => {

    if (!user) return {};

    return {
        id: user._id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    };
}

export const getArrayOfUsersViewModel = async (user: UserDbModel[] | []): Promise<UserViewModel[] | []> => {
    if (Array.isArray(user)){
        return user.map(currentUser => ({
            id: currentUser._id,
            login: currentUser.login,
            email: currentUser.email,
            createdAt: currentUser.createdAt
        }));
    }
    return []
}