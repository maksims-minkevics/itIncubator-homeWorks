export const consts = {
    POSTS_COLLECTION: "Posts",
    BLOGS_COLLECTION: "Blogs",
    EXP_REFRESH_TOKEN_COLLECTION: "ExpiredRefreshTokens",
    USER_COLLECTION: "Users",
    COMMENTS_COLLECTION: "Cooments",
    DB_NAME: "BlogerPlatform",
    DEFAULT_JWT_SALT: "SASASASVDVDRR",
    DEFAULT_FROM_EMAIL: 'Max <itiincubator.training1312@training.com>',
    SESSIONS_COLLECTION: "Sessions",
    ACTIVITY_AUDIT_COLLECTION: "ActivityAudit",
    TESTING_BASE_END_POINT: "testing",
    POSTS_BASE_END_POINT: "posts",
    BLOGS_BASE_END_POINT: "blogs",
    USERS_BASE_END_POINT: "users",
    AUTH_BASE_END_POINT: "auth",
    COMMENTS_BASE_END_POINT: "comments",
    SECURITY_DEVICES_BASE_END_POINT: "security/devices",
    AUDIT_BASE_END_POINT: "audit",
    END_POINTS: {
        USER: {
            GET: "/",
            CREATE: "/",
            DELETE_BY_ID: "/:id",
        },
        TESTING: {
            DELETE_ALL_DATA: "/all-data"
        },
        SESSION: {
            GET_ACTIVE_DEVICES: "/",
            DELETE: "/",
            DELETE_BY_ID: "/:deviceId",
        },
        POSTS: {
            GET: "/",
            GET_BY_ID: "/:id",
            CREATE: "/",
            DELETE_BY_ID: "/:id",
            UPDATE_BY_ID: "/:id",
            CREATE_COMMENT_FOR_SPECIFIC_POST: "/:id/comments",
            GET_COMMENTS_FOR_SPECIFIC_POST: "/:id/comments"

        },
        COMMENTS: {
            GET: "/",
            UPDATE_BY_ID: "/:id",
            DELETE_BY_ID: "/:id",
        },
        BLOGS: {
            GET: "/",
            GET_BY_ID: "/:id",
            UPDATE_BY_ID: "/:id",
            DELETE_BY_ID: "/:id",
            CREATE: "/",
            CREATE_POST_FOR_BLOG: "/:id/posts",
            GET_POSTS_FOR_BLOG: "/:id/posts",
        },
        AUTH: {
            LOGIN: "/login",
            GET_DATA_ABOUT_CURRENT_ACTIVE_USER: "/me",
            REG_CONFIRMATION: "/registration-confirmation",
            REGISTRATION: "/registration",
            RESEND_REG_CONF_EMAIL: "/registration-email-resending",
            REFRESH_TOKEN: "/refresh-token",
            LOGOUT: "/logout"

        }
    }
}