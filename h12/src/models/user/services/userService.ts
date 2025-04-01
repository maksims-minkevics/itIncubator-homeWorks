import {UserInputModel, UserViewModel, UserDbModel} from "../dataModels";
import {getArrayOfUsersViewModels, getUserViewModel} from "./userMapper";
import {DefaultResult, GetResult, ServiceResult} from "../../../general";
import {paginateResult} from "../../../general/globalServices";
import {getActiveUserViewModel} from "../../auth/services/authMapper";
import {ActiveUserViewModel} from "../../auth/dataModels";
import {DeleteResult, UpdateResult} from "mongodb";
import {UserRepository} from "../repository";
import {UserBusinessValidator} from "../middlewares/validations/userBusinessValidator";
import {PasswordService} from "./passwordService";
import e from "express";

export class UserService {
    constructor(
        protected userRepository: UserRepository,
        protected userBusinessValidator: UserBusinessValidator,
        protected passwordService: PasswordService
    ) {}
    async createUser(
        userData: UserInputModel,
        isActivated: boolean,
        confirmationCode = ""
    ): Promise<ServiceResult<UserViewModel>> {
        const validationResult = await this.userBusinessValidator.validateUserData(userData)
        if (!validationResult.status) return {data: null, status: false, msg: validationResult.data}
        const newUser = await this.userRepository.create(userData, isActivated, confirmationCode);
        const userViewModel = await getUserViewModel(newUser);
        return { data: userViewModel, status: true  };
    }

    async createNewUser(userData: UserInputModel): Promise<ServiceResult<UserViewModel>> {
        userData.password = await this.passwordService.hash(userData.password);
        const newUser = await this.createUser(userData, true);
        if (!newUser.status){
            return {data: null, status: false, msg: newUser.msg}
        }
        return { data: newUser.data, status: true  };
    }

    async find(
        login: string,
        email: string,
        sortBy: string,
        sortDir: number,
        pages: number,
        size: number
    ): Promise<ServiceResult<GetResult<UserViewModel>>>{

        const users = await this.userRepository.findMany({
            searchLoginTerm: login,
            searchEmailTerm: email,
            sortBy: sortBy,
            sortDir: sortDir,
            page: pages,
            size: size,
})
        const userViewModels = await getArrayOfUsersViewModels(users.data);
        const paginatedResult = paginateResult(
            { totalCount: users.totalCount, data: userViewModels },
            size,
            pages
        );

        return {data: paginatedResult, status: true}
    }

    async findByEmailOrLogin(login: string, email: string): Promise<ServiceResult<ActiveUserViewModel>> {
        const result = await this.userRepository.findByEmailOrLogin(login, email);
        if (!result){
            return {data: null, status: false}
        }
        const viewModel = await getActiveUserViewModel(result)
        return {data: viewModel, status: true}
    }

    async findByEmailOrLoginDbModel(login: string, email: string): Promise<ServiceResult<UserDbModel>> {
        const result = await this.userRepository.findByEmailOrLogin(login, email);
        if (!result){
            return {data: null, status: false}
        }
        return {data: result, status: true}
    }

    async findByField(data: Partial<UserDbModel>): Promise<ServiceResult<UserDbModel>> {
        const result = await this.userRepository.findByField(data);
        if (!result){
            return {data: null, status: false}
        }
        return {data: result, status: true}
    }

    async delete(userId: string): Promise<ServiceResult<DeleteResult>>{
        if (!userId) {
            return {data: null, status: false}
        }
        return {data: await this.userRepository.delete(userId), status: true}
    }

    async confirmCode(code: string): Promise<ServiceResult<UserDbModel>> {
        if (!code) {
            return {data: null, status: false}
        }
        const result = await this.userRepository.confirmEmail(code);
        if (!result){
            return {data: null, status: false}
        }
        if (result.matchedCount === 0){
            return {data: null, status: false}
        }

        return {data: null, status: true}
    };

    async setNewConfirmationCode(email: string, code: string): Promise <ServiceResult<UserDbModel>>{
        if (!email){
            return {data: null, status: false}
        }
        const result = await this.userRepository.setNewConfirmationCode(code, email);

        if(!result){
            return {data: null, status: false}
        }

        return {data: null, status: true}
    };

    async updatePassword(password: string, email: string, oldPassword: string): Promise <ServiceResult<DefaultResult>>{
        if (!(password && email)){
            return {data: null, status: false}
        }

        if(oldPassword === password){
            return {data: null, status: false}
        }

        const result = await this.userRepository.updatePassword(password,email);

        if(result.matchedCount === 0){
            return {data: null, status: false}
        }

        return {data: null, status: true}
    };

    async setRecoveryCode(code: string, email: string): Promise <ServiceResult<UpdateResult<UserDbModel>>>{
        if (!(code && email)){
            return {data: null, status: false}
        }
        const result = await this.userRepository.setRecoveryCode(code, email);
        return {data: result, status: true}
    };

    async getUserByRecoveryCode(code: string): Promise<ServiceResult<UserDbModel>>
    {
        if (!code){
            return {data: null, status: false}
        }
        const result = await this.userRepository.findByField({pswrdRecoveryCode: code});
        if (!result) {
            return {data: null, status: false}
        }

        return {data: result, status: true}
    };


}
