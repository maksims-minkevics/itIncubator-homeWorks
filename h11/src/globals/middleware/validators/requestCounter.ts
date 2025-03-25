import {Request, Response, NextFunction} from "express";
import {consts, HTTP_STATUS} from "../../../general/global-consts";
import {ioc} from "../../../general/composition-root";
import {LoggingService} from "../../../models/logs/services/logService";
const loggingServiceInstance = ioc.getInstance(LoggingService);
export const requestCounter = async (req: Request, resp: Response, next: NextFunction)=> {
    await loggingServiceInstance.add(req.originalUrl, req.ip as string);
    const result =  await loggingServiceInstance.get(req.originalUrl, req.ip as string)
    //console.log(`\x1b[34mRequest count - ${result.data}\x1b[0m`);
    if (result.data && result.data > consts.REQUEST_COUNT){
        return resp
            .status(HTTP_STATUS.TOO_MANY_REQUESTS)
            .end();
    }
    next();
    return ;
}