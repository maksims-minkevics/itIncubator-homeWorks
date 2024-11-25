import {BlogViewModel, GetResult, PostViewModel} from "../object-types";

class GetResultClass implements GetResult {
    pagesCount = 0;
    page = 0;
    pageSize = 0;
    totalCount = 0;
    items: BlogViewModel[] | PostViewModel[] | [] = [];
}

export { GetResultClass };
