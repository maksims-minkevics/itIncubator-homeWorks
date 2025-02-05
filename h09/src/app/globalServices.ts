import {dbQueryResultForPagination, GetResult, viewModelResultForPagination} from "./index";


export const paginateResult = async (dbResult: viewModelResultForPagination, pageSize: number, pageNumber: number): Promise <GetResult> => {
    const totalDocuments = dbResult.totalCount;
    return {
        pagesCount: Math.ceil(totalDocuments / pageSize),
        page: pageNumber,
        pageSize,
        totalCount: totalDocuments,
        items: dbResult.data,
    };

}
