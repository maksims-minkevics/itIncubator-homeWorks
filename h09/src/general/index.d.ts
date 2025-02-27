export type GetResult<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[]
};

export type Error = {
    field: string,
    message: string
};

export type ErrorResult = {
    errorsMessages: Error[]
};

export type JwtTokenData = {
    userId: string,
    userLogin: string
}

declare global {
    namespace Express {
        export interface Request {
            user: JwtTokenData,
            refreshToken: string,
            deviceId: string
        }
    }
}

export type ServiceResult<T> = {
    status: boolean;  // ✅ true (успех) или false (ошибка)
    data?: T | null;  // ✅ Данные, если они есть (T) или null
    msg?: {} | ErrorResult | null;     // ✅ Сообщение об ошибке (если есть)
};

export type DefaultResult = any;


export type viewModelResultForPagination<T> = {
    totalCount: number;
    data: T[];
};

export type ActivityAuditDbModel = {
    ip: string,
    url: string,
    date: Date
}
