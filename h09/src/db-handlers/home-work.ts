import {hwDataCollection} from "../app/db";


class hwDataDbHandler{
    async get(){
        return await hwDataCollection.find().toArray()

    }
}

export {hwDataDbHandler}