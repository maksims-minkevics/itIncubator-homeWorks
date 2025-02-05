import {Router} from "express";
import {blogDbHandlerClass} from "../db-handlers/blogs-db-handler";
import {postDbHandlerClass} from "../db-handlers/posts-db-handler";
import {userRepository} from "../models/user/repositories";
import {commentDbHandlerClass} from "../db-handlers/comment-db-handler";
import {sessionRepository} from "../models/session/repositories";
import {activityAuditDbHandler} from "../db-handlers/activity-audit-db-handler";
import {consts} from "../app/global-consts";


export const testingRouter = Router({});

testingRouter.delete(consts.END_POINTS.TESTING.DELETE_ALL_DATA, async (req, resp) =>{
    const blogDbHandler = new blogDbHandlerClass();
    const postDbHandler = new postDbHandlerClass();
    const commentDbHandler = new commentDbHandlerClass();
    const auditDbHandler = new activityAuditDbHandler();
    await blogDbHandler.dropDb();
    await postDbHandler.dropDb();
    await userRepository.dropDb();
    await commentDbHandler.dropDb();
    await sessionRepository.dropDb();
    await auditDbHandler.dropDb();
    return resp
        .sendStatus(204);

})