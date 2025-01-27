import dotenv from 'dotenv'
export const dotEnv = dotenv.config
export const settings = {
    RESP_CODES: {
        NOT_FOUND_ERR: 404,
        CREATED: 201,
        OK: 200,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401
    },
    REFRESH_TOKEN_PARAMETERS: {httpOnly: true, secure: true},
    REFRESH_TOKEN_EXP_TIME: 20,
    AUTH_TOKEN_EXP_TIME: 10
};

