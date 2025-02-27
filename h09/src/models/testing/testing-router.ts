import {Router} from "express";
import {userRepository} from "../user/repositories";
import {sessionRepository} from "../session/repositories";
import {HTTP_STATUS} from "../../general/global-consts";
import {postRepository} from "../post/repositories";
import {blogRepository} from "../blog/repositories";
import {commentRepository} from "../comment/repositories";
import {TESTING_ENDPOINTS} from "./endpoints";


export const testingRouter = Router();

testingRouter.delete(
    TESTING_ENDPOINTS.DELETE_ALL_DATA,
    async (req, resp) =>{
        await blogRepository.dropDb();
        await postRepository.dropDb();
        await userRepository.dropDb();
        await commentRepository.dropDb();
        await sessionRepository.dropDb();
        return resp
            .status(HTTP_STATUS.NO_CONTENT)
            .end();
    }
)