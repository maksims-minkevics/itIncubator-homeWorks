import dotenv from 'dotenv';
dotenv.config();
export const consts = {
  POSTS_COLLECTION: 'Posts',
  BLOGS_COLLECTION: 'Blogs',
  EXP_REFRESH_TOKEN_COLLECTION: 'ExpiredRefreshTokens',
  USER_COLLECTION: 'Users',
  COMMENTS_COLLECTION: 'Cooments',
  DB_NAME: 'BlogerPlatform',
  DEFAULT_JWT_SALT: 'SASASASVDVDRR',
  DEFAULT_FROM_EMAIL: 'Max <itiincubator.training1312@training.com>',
  SESSIONS_COLLECTION: 'Sessions',
  ACTIVITY_AUDIT_COLLECTION: 'ActivityAudit',
  COMMENTS_BASE_END_POINT: 'comments',
  SECURITY_DEVICES_BASE_END_POINT: 'security/devices',
  AUDIT_BASE_END_POINT: 'audit',
  SALT_ROUNDS: 10,
  REQUEST_COUNT: 50,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  FORBIDDEN: 403,
  TOO_MANY_REQUESTS: 429,
};

export const SERVICE_CUSTOM_MSG = {
  NOT_FOUND: 'Not found',
  ACCESS_DENIED: 'Permission denied',
  DB_ERROR: 'Database error',
};

export const CUSTOM_MSG = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
};

export const BASE_URL = process.env.BASE_URL || '/api';
