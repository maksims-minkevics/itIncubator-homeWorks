import {Request, Response, Router} from "express";
import {userValidation} from "../midlewares/validations/user-validation";
import {userHelper} from "../business-logic/user-business-logic";
import {validationParser} from "../midlewares/validations/validation-parser";
export const userRouter = Router({});

userRouter.get("/", async (req: Request, resp: Response) =>{


})

userRouter.post("/", userValidation, validationParser, async (req: Request, resp: Response) =>{

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

userRouter.delete("/:id", async (req: Request, resp: Response) =>{


})