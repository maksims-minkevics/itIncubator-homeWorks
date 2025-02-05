import {ErrorResult} from "../../app/index";
import {ObjectId} from "mongodb";

export type UserViewModel = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: string
};

export type UserInputModel = {
    login: string,
    password: string,
    email: string
};

export type UserDataValidationResult = {
    _isValidationFailed: boolean,
    data: ErrorResult | {},
    user?: UserDbModel
}

export type UserDbModel = {
    _id: ObjectId;
    login: string,
    password: string,
    email: string,
    createdAt: string
    confirmationCode: string,
    isActivated: boolean,
};

export type UserDbInsertModel = {
    _id?: ObjectId;
    login: string,
    password: string,
    email: string,
    createdAt: string
    confirmationCode: string,
    isActivated: boolean,
};


