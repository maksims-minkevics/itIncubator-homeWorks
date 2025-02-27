import { userRepository } from "../repositories";
import {UserInputModel, UserViewModel, UserDbModel} from "../dataModels";
import { passwordService } from "./passwordService";
import {userBusinessValidator} from "../middlewares/validations/userBusinessValidator";
import {getArrayOfUsersViewModels, getUserViewModel} from "./userMapper";
import {ErrorResult, GetResult, ServiceResult} from "../../../general/index";
import {paginateResult} from "../../../general/globalServices";
import {getActiveUserViewModel} from "../../auth/services/authMapper";
import {ActiveUserViewModel} from "../../auth/dataModels";
import { DeleteResult } from "mongodb";

export const userService = {
    async createUser(
        userData: UserInputModel,
        isActivated: boolean,
        confirmationCode = ""
    ): Promise<ServiceResult<UserViewModel>> {
        const validationResult = await userBusinessValidator.validateUserData(userData)
        if (!validationResult.status) return {data: null, status: false, msg: validationResult.data}
        userData.password = await passwordService.hash(userData.password);
        const newUser = await userRepository.create(userData, isActivated, confirmationCode);
        const userViewModel = await getUserViewModel(newUser);
        return { data: userViewModel, status: true  };
    },

    async createNewUser(userData: UserInputModel): Promise<ServiceResult<UserViewModel>> {
        const newUser = await userService.createUser(userData, true);
        if (!newUser.status){
            return {data: null, status: false, msg: newUser.msg}
        }
        return { data: newUser.data, status: true  };
    },

    async find(
        login: string,
        email: string,
        sortBy: string,
        sortDir: number,
        pages: number,
        size: number
    ): Promise<ServiceResult<GetResult<UserViewModel>>>{

        const users = await userRepository.findMany({
            searchLoginTerm: login,
            searchEmailTerm: email,
            sortBy: sortBy,
            sortDirection: sortDir,
            pageNumber: pages,
            pageSize: size,
        })
        const userViewModels = await getArrayOfUsersViewModels(users.data);
        const paginatedResult = paginateResult(
            { totalCount: users.totalCount, data: userViewModels },
            size,
            pages
        );

        return {data: paginatedResult, status: true}

    },
    async findByEmailOrLogin(login: string, email: string): Promise<ServiceResult<ActiveUserViewModel>> {
        const result = await userRepository.findByEmailOrLogin(login, email);
        if (!result){
            return {data: null, status: false}
        }
        const viewModel = await getActiveUserViewModel(result)
        return {data: viewModel, status: true}
    },

    async findByEmailOrLoginDbModel(login: string, email: string): Promise<ServiceResult<UserDbModel>> {
        const result = await userRepository.findByEmailOrLogin(login, email);
        if (!result){
            return {data: null, status: false}
        }
        return {data: result, status: true}
    },

    async findByField(data: Partial<UserDbModel>): Promise<ServiceResult<UserDbModel>> {
        const result = await userRepository.findByField(data);
        if (!result){
            return {data: null, status: false}
        }
        return {data: result, status: true}
    },

    async delete(userId: string): Promise<ServiceResult<DeleteResult>>{
        if (!userId) {
            return {data: null, status: false}
        }
        return {data: await userRepository.delete(userId), status: true}
    },

};
