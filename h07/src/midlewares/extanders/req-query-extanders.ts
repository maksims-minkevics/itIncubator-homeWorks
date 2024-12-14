import {NextFunction, Request, Response} from "express";


export const getBlogQueryExtander = (req: Request, resp: Response, next: NextFunction) =>{
    req.query.searchNameTerm = req.query.searchNameTerm || "";
    req.query.sortBy = req.query.sortBy || "createdAt";
    req.query.sortDirection = req.query.sortDirection && req.query.sortDirection == "asc"? "1" : "-1";
    req.query.pageNumber = req.query.pageNumber || "1";
    req.query.pageSize = req.query.pageSize || "10";
    next();
}

export const getUserQueryExtander = (req: Request, resp: Response, next: NextFunction) =>{
    req.query.searchNameTerm = req.query.searchNameTerm || "";
    req.query.sortBy = req.query.sortBy || "createdAt";
    req.query.sortDirection = req.query.sortDirection && req.query.sortDirection == "asc"? "1" : "-1";
    req.query.pageNumber = req.query.pageNumber || "1";
    req.query.pageSize = req.query.pageSize || "10";
    req.query.searchLoginTerm = req.query.searchLoginTerm || "";
    req.query.searchEmailTerm = req.query.searchEmailTerm || "";
    next();
}

export const getRegCode = (req: Request, resp: Response, next: NextFunction) =>{
    req.query.code = req.query.code || "";
    next();
}

