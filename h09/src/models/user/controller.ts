import {Request, Response} from "express";
import {userHelper} from "./user-business-logic";
import {UserDbModel} from "./dataModels";
import {paginateResult} from "../../app/globalServices";
import {getArrayOfUsersViewModel, getUserViewModel} from "./services/userMapper";

export const findByEmailOrLogin = async (req: Request, resp: Response) =>{

    const users = await userHelper
        .dbHandler
        .findMany({
                searchLoginTerm: req.query.searchLoginTerm as string,
                searchEmailTerm: req.query.searchEmailTerm as string,
                sortBy: req.query.sortBy as string,
                sortDirection: +(req.query.sortDirection as string),
                pageNumber: +(req.query.pageNumber as string),
                pageSize: +(req.query.pageSize as string)
            }
        )
    const userViewModels = await getArrayOfUsersViewModel(users.data as UserDbModel[] | []);

    return resp
        .status(200)
        .json(
            await paginateResult({totalCount: users.totalCount, data: userViewModels},  +(req.query.pageSize as string), +(req.query.pageNumber as string))
        );
};

export const createNew = async (req: Request, resp: Response) =>{
    const userCreationData = await userHelper.createNewUser(req.body);
    if(userCreationData._isValidationFailed){
        console.log("status code", 400)
        return resp
            .status(400)
            .json(userCreationData.data);
    }
    return resp
        .status(201)
        .json(
            await userHelper.getUserViewModel(userCreationData.user as UserDbModel)
        );
};

export const deleteById = async (req: Request, resp: Response) =>{
    const userId = req.params.id;
    if (!userId){
        return resp
            .sendStatus(404);
    }

    const user = await userHelper.dbHandler.delete(userId);

    if (!user){
        return resp
            .sendStatus(404);
    }

    return resp
        .status(204)
        .json(user);
}