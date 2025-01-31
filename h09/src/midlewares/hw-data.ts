import {Request, Response, NextFunction} from "express";
import {HomeWorkData} from "../app/index";
import jwt from "jsonwebtoken";
import {hwDataCollection} from "../app/db";

export const saveHwData = async (req: Request, resp: Response, next: NextFunction) =>{
    let refreshTokenData = undefined
        if (req.headers['cookie']){
            refreshTokenData = jwt.decode(
                req.headers['cookie'].split('=')[1]
            )
        }
        const newNode: HomeWorkData = {
            reqBody: req.body,
            reqUrl: req.url,
            reqHeaders: req.headers,
            reqMethod: req.method,
            time: new Date(),
            refreshToken: req.headers['cookie'] || "",
            parsedRefteshToken: refreshTokenData
        }
    await hwDataCollection.insertOne(newNode);
    next();
}