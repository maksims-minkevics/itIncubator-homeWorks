import dotenv from 'dotenv'
export const dotEnv = dotenv.config
export const SETTINGS = {
    RESP_CODES: {
        NOT_FOUND_ERR: 404,
        CREATED: 201,
        OK: 200,
        NO_CONTENT: 204,
        BAD_REQUEST: 400
    },
};

