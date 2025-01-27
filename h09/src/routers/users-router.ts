import {Request, Response, Router} from "express";
import {userValidation} from "../midlewares/validations/user-validation";
import {userHelper} from "../business-logic/user-business-logic";
import {validationParser} from "../midlewares/validations/validation-parser";
import {getUserQueryExtander} from "../midlewares/extanders/req-query-extanders";
import {authorization1} from "../midlewares/validations/authorization";
import {UserDbModel} from "../app/index";
import {consts} from "../app/global-consts";
export const userRouter = Router({});

userRouter.get(consts.END_POINTS.USER.GET,
    authorization1,
    getUserQueryExtander,
    async (req: Request, resp: Response) =>{
        return resp
        .status(200)
        .json(await userHelper
            .dbHandler
            .getAllUsers({
                    searchLoginTerm: req.query.searchLoginTerm as string,
                    searchEmailTerm: req.query.searchEmailTerm as string,
                    sortBy: req.query.sortBy as string,
                    sortDirection: +(req.query.sortDirection as string),
                    pageNumber: +(req.query.pageNumber as string),
                    pageSize: +(req.query.pageSize as string)
            }
            )
        );
})

userRouter.post(consts.END_POINTS.USER.CREATE,
    authorization1,
    userValidation,
    validationParser,
    async (req: Request, resp: Response) =>{
    const userCreationData = await userHelper.createNewUser(req.body);
    if(userCreationData._isValidationFailed){
        return resp
            .status(400)
            .json(userCreationData.data);
    }
    return resp
        .status(201)
        .json(
            await userHelper.getUserViewModel(userCreationData.user as UserDbModel)
        );
})

userRouter.delete(consts.END_POINTS.USER.DELETE_BY_ID,
    authorization1,
    async (req: Request, resp: Response) =>{
    const usertId = req.params.id;
    if (!usertId){
        return resp
            .sendStatus(404);
    }

    const user = await userHelper.dbHandler.deleteUser(usertId);

    if (!user){
        return resp
            .sendStatus(404);
    }

    return resp
        .status(204)
        .json(user);
})