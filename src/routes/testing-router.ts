import {Router} from "express";
import {createDb} from "../db";
export const db = createDb();

export const testingRouter = Router({});

testingRouter.delete("/all-data", (req, resp) =>{
    db.videos = [];
    resp
        .sendStatus(204)

})