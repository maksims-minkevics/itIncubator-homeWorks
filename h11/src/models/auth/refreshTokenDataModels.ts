//Status:
//false - failed
//true - success
import {RefreshTokenData} from "./dataModels";

export type RefreshTokenServiceResult = {
    status: boolean,
    data: RefreshTokenData
    msg?: {}
}