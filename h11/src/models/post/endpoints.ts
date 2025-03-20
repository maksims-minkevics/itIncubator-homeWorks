import {BASE_URL} from "../../general/global-consts";
import {BLOGS_ENDPOINTS} from "../blog/endpoints";

export const POSTS_ENDPOINTS = {
    GENERAL: `${process.env.BASE_URL}/posts/`,
    GET: `/posts`,
    DELETE: `/posts`,
    GET_BY_ID: (id: string) => `/posts/${id}`,
    CREATE: "/posts",
    UPDATE_BY_ID: (id: string) => `/posts/${id}`,
    CREATE_COMMENT_FOR_SPECIFIC_POST: (id: string) => `/posts/${id}/comments`,
    GET_COMMENTS_FOR_SPECIFIC_POST: (id: string) => `/posts/${id}/comments`,
    DELETE_BY_ID: (id: string) => `/posts/${id}`,
}

export const POSTS_FULL_URLS = {
    GET: `${BASE_URL}${POSTS_ENDPOINTS.GET}`,
    DELETE: `${BASE_URL}${POSTS_ENDPOINTS.DELETE}`,
    GET_BY_ID: (id: string) => `${BASE_URL}${POSTS_ENDPOINTS.GET_BY_ID(id)}`,
    CREATE: `${BASE_URL}${POSTS_ENDPOINTS.CREATE}`,
    UPDATE_BY_ID: (id: string) => `${BASE_URL}${POSTS_ENDPOINTS.UPDATE_BY_ID(id)}`,
    CREATE_COMMENT_FOR_SPECIFIC_POST: (id: string) => `${BASE_URL}${POSTS_ENDPOINTS.CREATE_COMMENT_FOR_SPECIFIC_POST(id)}`,
    DELETE_BY_ID: (id: string) => `${BASE_URL}${POSTS_ENDPOINTS.DELETE_BY_ID(id)}`,
    GET_WITH_QUERY_PARAMS: (query: string) => `${BASE_URL}${POSTS_ENDPOINTS.GET}/?${query}`,
    GET_COMMENTS_FOR_SPECIFIC_POST_WITH_QUERY_PARAMS: (postId: string, query: string) => `${BASE_URL}${POSTS_ENDPOINTS.GET_COMMENTS_FOR_SPECIFIC_POST(postId)}/?${query}`
};