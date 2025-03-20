import {UserDbModel} from "../../user/dataModels";
import {ActiveUserViewModel} from "../dataModels";

export const getActiveUserViewModel = async (user: UserDbModel): Promise<ActiveUserViewModel | null> => {

    if (!user) return null;

    return {
        userId: user._id.toString(),
        login: user.login,
        email: user.email
    };
}