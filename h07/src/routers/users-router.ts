import {Request, Response, Router} from "express";
import {userValidation} from "../midlewares/validations/user-validation";
import {userHelper} from "../business-logic/user-business-logic";
import {validationParser} from "../midlewares/validations/validation-parser";
import {getUserParamExtander} from "../midlewares/extanders/get-req-param-extanders";
import {authorization, authorization1} from "../midlewares/validations/authorization-validation";
export const userRouter = Router({});

userRouter.get("/",
    authorization1,
    getUserParamExtander,
    async (req: Request, resp: Response) =>{
    resp
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
        }))
})

userRouter.post("/",
    authorization1,
    userValidation,
    validationParser,
    async (req: Request, resp: Response) =>{

    const result = await userHelper.createNewUser(req.body);
    if('errorsMessages' in result){
        resp
            .status(400)
            .json(result)
        return

    }
    resp
        .status(201)
        .json(result)
})

userRouter.delete("/:id",
    authorization1,
    async (req: Request, resp: Response) =>{
    const usertId = req.params.id;

    if (!usertId){
        resp
            .sendStatus(404)
        return;
    }

    const user = await userHelper.dbHandler.deleteUser(usertId);

    if (!user){
        resp
            .sendStatus(404)
        return;
    }

    return resp
        .status(204)
        .json(user)
})