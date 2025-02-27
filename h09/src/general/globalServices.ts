import {GetResult, viewModelResultForPagination} from "./index";


export const paginateResult = <T>(
    data: viewModelResultForPagination<T>,
    pageSize: number,
    pageNumber: number
): GetResult<T> => {
    return {
        pagesCount: Math.ceil(data.totalCount / pageSize),
        page: pageNumber,
        pageSize,
        totalCount: data.totalCount,
        items: data.data,
    };
};
