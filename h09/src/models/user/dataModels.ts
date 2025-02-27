import {ErrorResult} from "../../general/index";
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

export type UserDataValidationResult = {
    status: boolean,
    data: ErrorResult | null
}

export type UserDbModel = {
    _id: ObjectId | string;
    login: string,
    password: string,
    email: string,
    createdAt: string
    confirmationCode: string,
    isActivated: boolean,
};

export type UserDbInsertModel = {
    _id?: string;
    login: string,
    password: string,
    email: string,
    createdAt: string
    confirmationCode: string,
    isActivated: boolean,
};

export type UserDbQueryResultForPagination = {
    data: UserDbModel[] | [],
    totalCount: number
};

