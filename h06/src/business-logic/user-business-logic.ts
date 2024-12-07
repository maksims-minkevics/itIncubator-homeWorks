import {userDbHandlerClass} from "../db-handlers/user-db-handler";
import {ErrorResult, UserInputModel, UserViewModel} from "../app/";

const bcrypt = require('bcrypt');
const userDbHandler = new userDbHandlerClass();
export const userHelper = {
    dbHandler: new userDbHandlerClass(),

    hashPwrd: async (pswrd: string): Promise<string> => {
        try {
            const SALT_ROUNDS = 10;
            return await bcrypt.hash(pswrd, SALT_ROUNDS);
        } catch (e) {
            console.error("Password hash failed", e);
            throw new Error("Failed to hash password");
        }
    },

    compare: async (pswrdHash: string, pawrd: string): Promise<boolean> => {
        try {
            return await bcrypt.compare(pawrd, pswrdHash);
        } catch (e) {
            console.error("Password compare failed", e);
            return false;
        }
    },

    isUserEmailUnique: async (email: string): Promise<boolean> => {
        const user = await userHelper.dbHandler.getUserByField('email', email);
        return !user;
    },

    isUserLoginUnique: async (login: string): Promise<boolean> => {
        const user = await userHelper.dbHandler.getUserByField('login', login);
        return !user;
    },

    createNewUser: async (user: UserInputModel): Promise<UserViewModel | ErrorResult> => {
        if (!await userHelper.isUserLoginUnique(user.login)) {
            return {
                errorsMessages: [{message: 'login should be unique',  field: 'login'}]
            };
        }

        if (!await userHelper.isUserEmailUnique(user.email)) {
            return {
                errorsMessages: [{message: 'email should be unique', field: 'email'}]
            };
        }

        const hashedPassword = await userHelper.hashPwrd(user.password);
        user.password = hashedPassword;
        const newUser = await userHelper.dbHandler.create(user);
        return newUser;
    },
};