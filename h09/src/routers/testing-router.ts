import {Router} from "express";
import {blogDbHandlerClass} from "../db-handlers/blogs-db-handler";
import {postDbHandlerClass} from "../db-handlers/posts-db-handler";
import {userDbHandlerClass} from "../db-handlers/user-db-handler";
import {commentDbHandlerClass} from "../db-handlers/comment-db-handler";
import {RefreshTokenMetaDataDbHandler} from "../db-handlers/refresh-token-meta-data-db-handler";
import {activityAuditDbHandler} from "../db-handlers/activity-audit-db-handler";
import {consts} from "../global-consts";


export const testingRouter = Router({});

testingRouter.delete(consts.END_POINTS.TESTING.DELETE_ALL_DATA, async (req, resp) =>{
    const blogDbHandler = new blogDbHandlerClass();
    const postDbHandler = new postDbHandlerClass();
    const userDbHandler = new userDbHandlerClass();
    const commentDbHandler = new commentDbHandlerClass();
    const refreshTokenDbHandler = new RefreshTokenMetaDataDbHandler();
    const auditDbHandler = new activityAuditDbHandler();
    await blogDbHandler.dropDb();
    await postDbHandler.dropDb();
    await userDbHandler.dropDb();
    await commentDbHandler.dropDb();
    await refreshTokenDbHandler.dropDb();
    await auditDbHandler.dropDb();
    return resp
        .sendStatus(204);

})