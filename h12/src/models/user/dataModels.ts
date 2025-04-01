import {ObjectId} from "mongodb";

export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
};

export type UserInputModel = {
    login: string,
    password: string,
    email: string
};

export type UserDbModel = {
    _id: ObjectId;
    login: string,
    password: string,
    email: string,
    createdAt: string
    confirmationCode: string,
    isActivated: boolean,
    pswrdRecoveryCode: string
};

export type UserDbInsertModel = {
    login: string,
    password: string,
    email: string,
    confirmationCode: string,
    isActivated: boolean,
};

export type UserDbQueryResultForPagination = {
    data: UserDbModel[] | [] | any,
    totalCount: number
};

