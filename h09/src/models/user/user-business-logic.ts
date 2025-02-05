import {userRepository} from "./repositories";
import bcrypt from "bcrypt";
import {UserDataValidationResult, UserDbModel, UserInputModel, UserViewModel} from "./dataModels";

export const userHelper = {
    dbHandler: userRepository,

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
        const user = await userHelper.dbHandler.findByField('email', email);
        return user === null;
    },

    isUserLoginUnique: async (login: string): Promise<boolean> => {
        const user = await userHelper.dbHandler.findByField('login', login);
        return user === null;
    },

    dataValidation: async (user: UserInputModel): Promise<UserDataValidationResult> =>{
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

    createNewUser: async (user: UserInputModel): Promise<UserDataValidationResult> => {
        const validationResult = await userHelper.dataValidation(user);
        if (validationResult._isValidationFailed === true){
            return {
                _isValidationFailed: true, data: validationResult.data
            };
        }

        const hashedPassword = await userHelper.hashPwrd(user.password);
        user.password = hashedPassword;
        const newUser = await userHelper.dbHandler.create(user, true);
        return {
            _isValidationFailed: false, data: {}, user: newUser
        };
    },

    newUserRegistration: async (user: UserInputModel): Promise<UserDataValidationResult> => {
        const validationResult = await userHelper.dataValidation(user);
        if (validationResult._isValidationFailed === true){
            return {
                _isValidationFailed: true, data: validationResult.data
            }
        }

        const hashedPassword = await userHelper.hashPwrd(user.password);
        user.password = hashedPassword;
        const code = await userHelper.generateConfirmationCode();
        const newUser = await userHelper.dbHandler.create(user, false, code);
        return {
            _isValidationFailed: false, data: {}, user: newUser
        };
    },
    //TODO
    //Change to more secure method (with less collision)
    generateConfirmationCode: async () => {
        return Date.now().toString() + Math.random().toString(36).substring(2, 8);
    },

    confirmRegistration: async (code: string): Promise<UserDataValidationResult> => {
        const isActivated =  await userHelper.dbHandler.confirmEmail(code);
        if (!isActivated){
            return {
                _isValidationFailed: true, data: {errorsMessages: [{message: 'incorrect code',  field: 'code'}]}
            }
        }
        return {
            _isValidationFailed: false, data: {}
        }

    },

    getUseForReConfirmation: async (email: string): Promise<UserDataValidationResult> => {
        const user = await userHelper.dbHandler.findByField("email", email)
        if (!user){
            return {                _isValidationFailed: true, data: {errorsMessages: [{message: 'incorrect email',  field: 'email'}]}
            }
        }

        if (user.isActivated){
            return {
                _isValidationFailed: true, data: {errorsMessages: [{message: 'User has already been confirmed',  field: 'email'}]}
            }
        }
        const updatedUser = await userHelper.dbHandler.updateUserConfirmationCode(await userHelper.generateConfirmationCode(), email);
        return {
            _isValidationFailed: false, data: {}, user: updatedUser as UserDbModel
        }

    },

    getUserViewModel: async (userDbObject: UserDbModel): Promise<UserViewModel> => {
        return {
            id: userDbObject._id,
            createdAt: userDbObject.createdAt,
            login: userDbObject.login,
            email: userDbObject.email,
        } as UserViewModel;
    },

};