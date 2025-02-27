import {BASE_URL} from "../../general/global-consts";

export const SESSION_ENDPOINTS = {
    GET_ACTIVE_DEVICES: `/security/devices`,
    DELETE: `/security/devices`,
    DELETE_BY_ID: (id: string) => {return `/security/devices/${id}`},
}


export const SESSION_FULL_URLS = {
    GET: `${BASE_URL}${SESSION_ENDPOINTS.GET_ACTIVE_DEVICES}`,
    DELETE: `${BASE_URL}${SESSION_ENDPOINTS.DELETE}`,
    DELETE_BY_ID: (id: string) => `${BASE_URL}${SESSION_ENDPOINTS.DELETE_BY_ID(id)}`,
};