import {Router} from "express";
import {HTTP_STATUS} from "../../general/global-consts";
import {TESTING_ENDPOINTS} from "./endpoints";
import {
        blogsRepositoryInstance,
        commentsRepositoryInstance,
        postsRepositoryInstance,
        sessionRepositoryInstance,
        userRepositoryInstance
} from "../../general/composition-root";


export const testingRouter = Router();

testingRouter.delete(
    TESTING_ENDPOINTS.DELETE_ALL_DATA,
    async (req, resp) =>{
        await blogsRepositoryInstance.dropDb();
        await postsRepositoryInstance.dropDb();
        await userRepositoryInstance.dropDb();
        await commentsRepositoryInstance.dropDb();
        await sessionRepositoryInstance.dropDb();
        return resp
            .status(HTTP_STATUS.NO_CONTENT)
            .end();
    }
)