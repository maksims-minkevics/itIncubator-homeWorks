import {DefaultResult, ServiceResult} from "../../../general";
import {prototype} from "cookie-parser";
import {LogRepository} from "../repository";

export class LoggingService{
    constructor(protected logRepository: LogRepository) {
    }
    async add(url: string, ip: string): Promise<ServiceResult<DefaultResult>>{
        await this.logRepository.create(ip, url);
    }

    async dropDb(url: string, ip: string): Promise<ServiceResult<DefaultResult>>{
        await this.logRepository.dropDb();
    }

    async get(url: string, ip: string): Promise<ServiceResult<DefaultResult>>{
        const tenSecondsAgo = new Date(new Date().getTime() - 10 * 1000);
        await this.logRepository.getRequestNumberByDate(url, ip, tenSecondsAgo);
    }

}