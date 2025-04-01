import {BASE_URL} from "../../general/global-consts";

export const USER_ENDPOINTS = {
    GET_ALL: `/users`,
    CREATE: `/users`,
    DELETE_BY_ID: (id: string) => {return `/users/${id}`},
}


export const USER_FULL_URLS = {
    GET_ALL: `${BASE_URL}${USER_ENDPOINTS.GET_ALL}`,
    CREATE: `${BASE_URL}${USER_ENDPOINTS.CREATE}`,
    DELETE_BY_ID: (id: string) => `${BASE_URL}${USER_ENDPOINTS.DELETE_BY_ID(id)}`,
};