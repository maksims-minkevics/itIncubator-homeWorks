import {BASE_URL} from "../../general/global-consts";

export const COMMENTS_ENDPOINTS = {
    GET_BY_ID: (id: string) => `/comments/${id}`,
    UPDATE_BY_ID: (id: string) => `/comments/${id}`,
    DELETE_BY_ID: (id: string) => `/comments/${id}`,
}

export const COMMENTS_FULL_URLS = {
    GET_BY_ID: (id: string) => `${BASE_URL}${COMMENTS_ENDPOINTS.GET_BY_ID(id)}`,
    UPDATE_BY_ID: (id: string) => `${BASE_URL}${COMMENTS_ENDPOINTS.UPDATE_BY_ID(id)}`,
    DELETE_BY_ID: (id: string) => `${BASE_URL}${COMMENTS_ENDPOINTS.DELETE_BY_ID(id)}`,
};