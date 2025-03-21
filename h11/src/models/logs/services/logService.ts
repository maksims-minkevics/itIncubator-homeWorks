import {DefaultResult, ServiceResult} from "../../../general";
import {LogRepository} from "../repository";

export class LoggingService{
    constructor(protected logRepository: LogRepository) {
    }
    async add(url: string, ip: string): Promise<ServiceResult<DefaultResult>>{
        await this.logRepository.create(ip, url);
        return {data: null, status: true}
    }

    async dropDb(){
        await this.logRepository.dropDb();
    }

    async get(url: string, ip: string): Promise<ServiceResult<DefaultResult>>{
        console.log("called")
        const tenSecondsAgo = new Date(new Date().getTime() - 10 * 1000);
        const result = await this.logRepository.getRequestNumberByDate(url, ip, tenSecondsAgo);
        return {data: result, status: true}
    }

}