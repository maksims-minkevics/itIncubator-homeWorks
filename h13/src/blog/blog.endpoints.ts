import { BASE_URL } from '../general/general.consts';

export const BLOGS_ENDPOINTS = {
  GENERAL: `${process.env.BASE_URL}/blogs/`,
  GET: `/blogs`,
  CREATE: `/blogs`,
  GET_POST_BY_BLOG_ID: (id: string) => `/blogs/${id}/posts`,
  CREATE_POST_FOR_SPECIFIC_BLOG: (id: string) => `/blogs/${id}/posts`,
  GET_BY_ID: (id: string) => `/blogs/${id}`,
  UPDATE_BY_ID: (id: string) => `/blogs/${id}`,
  DELETE_BY_ID: (id: string) => `/blogs/${id}`,
};

export const BLOGS_FULL_URLS = {
  GET: `${BASE_URL}${BLOGS_ENDPOINTS.GET}`,
  GET_WITH_QUERY_PARAMS: (query: string) =>
    `${BASE_URL}${BLOGS_ENDPOINTS.GET}/?${query}`,
  CREATE: `${BASE_URL}${BLOGS_ENDPOINTS.CREATE}`,
  GET_POST_BY_BLOG_ID: (id: string) =>
    `${BASE_URL}${BLOGS_ENDPOINTS.GET_POST_BY_BLOG_ID(id)}`,
  CREATE_POST_FOR_SPECIFIC_BLOG: (id: string) =>
    `${BASE_URL}${BLOGS_ENDPOINTS.CREATE_POST_FOR_SPECIFIC_BLOG(id)}`,
  GET_BY_ID: (id: string) => `${BASE_URL}${BLOGS_ENDPOINTS.GET_BY_ID(id)}`,
  UPDATE_BY_ID: (id: string) =>
    `${BASE_URL}${BLOGS_ENDPOINTS.UPDATE_BY_ID(id)}`,
  DELETE_BY_ID: (id: string) =>
    `${BASE_URL}${BLOGS_ENDPOINTS.DELETE_BY_ID(id)}`,
};
