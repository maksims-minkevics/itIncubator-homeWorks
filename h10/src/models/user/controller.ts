import { Request, Response } from "express";
import { HTTP_STATUS } from "../../general/global-consts";
import {UserService} from "./services/userService";

export class UserController {
    constructor(protected userService: UserService){
    }
    async findByEmailOrLogin(req: Request, res: Response) {
        try {

            const result = await this.userService.find(
                req.query.searchLoginTerm as string,
                req.query.searchEmailTerm as string,
                req.query.sortBy as string,
                Number(req.query.sortDirection),
                Number(req.query.pageNumber),
                Number(req.query.pageSize)
            )

            return res
                .status(HTTP_STATUS.OK)
                .json(result.data);

        } catch (error) {
            console.error("Error in findByEmailOrLogin:", error);
            return res
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({ message: "Internal Server Error" });
        }
    }

    async createNew(req: Request, res: Response) {
        try {
            const user = await this.userService.createNewUser(req.body);
            if (!user.status){
                return res
                    .status(HTTP_STATUS.BAD_REQUEST)
                    .json(user.msg);
            }

            return res
                .status(HTTP_STATUS.CREATED)
                .json(user.data);

        } catch (error) {
            console.error("Error in createNew:", error);
            return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }

    async deleteById(req: Request, res: Response) {
        try {

            const isUserDeleted = await this.userService.delete(req.params.id as string);
            if (!isUserDeleted.status) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .json({ message: "User not found" });
            }

            return res
                .status(HTTP_STATUS.NO_CONTENT)
                .end();

        } catch (error) {
            console.error("Error in deleteById:", error);
            return res
                .status(HTTP_STATUS.SERVER_ERROR)
                .json({ message: "Internal Server Error" });
        }
    }
}
