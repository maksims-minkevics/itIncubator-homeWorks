import {NextFunction, Request, Response} from "express";


export const getParamExtander = (req: Request, resp: Response, next: NextFunction) =>{
    console.log(req.query.sortDirection)
    req.query.searchNameTerm = req.query.searchNameTerm || "";
    req.query.sortBy = req.query.sortBy || "createdAt";
    req.query.sortDirection = req.query.sortDirection && req.query.sortDirection == "asc"? "1" : "-1";
    req.query.pageNumber = req.query.pageNumber || "1";
    req.query.pageSize = req.query.pageSize || "10";
    next();
}