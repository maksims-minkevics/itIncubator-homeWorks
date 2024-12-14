import {userDbHandlerClass} from "../db-handlers/user-db-handler";
import {ErrorResult, userDataValidationResult, UserInputModel, UserViewModel} from "../app/";
import bcrypt from "bcrypt";

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
        console.log("isUserEmailUnique",user !== null)
        return user === null;
    },

    isUserLoginUnique: async (login: string): Promise<boolean> => {
        const user = await userHelper.dbHandler.getUserByField('login', login);
        console.log("isUserLoginUnique",user !== null)
        return user === null;
    },


    dataValidation: async (user: UserInputModel): Promise<userDataValidationResult> =>{
        if (!await userHelper.isUserLoginUnique(user.login)) {
            return {
                _isValidationFailed: true, data: {errorsMessages: [{message: 'login should be unique',  field: 'login'}]}
            };
        }

        if (!await userHelper.isUserEmailUnique(user.email)) {
            return {
                _isValidationFailed: true, data: {errorsMessages: [{message: 'email should be unique', field: 'email'}]}
            };
        }
        return {_isValidationFailed: false, data: {}}
    },

    createNewUser: async (user: UserInputModel): Promise<UserViewModel | ErrorResult | {}> => {
        const validationResult = await userHelper.dataValidation(user);
        if (validationResult._isValidationFailed === true){
            return validationResult.data
        }

        const hashedPassword = await userHelper.hashPwrd(user.password);
        user.password = hashedPassword;
        const newUser = await userHelper.dbHandler.create(user, false);
        return newUser;
    },

    newUserRegistration: async (user: UserInputModel): Promise<UserViewModel | ErrorResult | {}> => {
        const validationResult = await userHelper.dataValidation(user);
        if (validationResult._isValidationFailed === true){
            return validationResult.data
        }

        const hashedPassword = await userHelper.hashPwrd(user.password);
        user.password = hashedPassword;
        const code = await userHelper.generateConfirmationCode();
        console.log(code)
        const newUser = await userHelper.dbHandler.create(user, false,code);
        return newUser;
    },
    //TODO
    //Change to more secure method (with less collision)
    generateConfirmationCode: async () => {
        return Date.now().toString() + Math.random().toString(36).substring(2, 8);
    },

    confirmRegistration: async (code: string): Promise<boolean> => {
        return await userHelper.dbHandler.checkAndConfirmEmail(code);
    },
};