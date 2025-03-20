// import { Schema, Document } from "mongoose";
// import {ObjectId} from "mongodb";
// import {JwtTokenData} from "../../general";
//
// export interface IAuth extends Document {
//     _id: ObjectId;
//     token: string,
//     deviceId: string,
//     user: JwtTokenData,
//     expireAt: string,
//     issuedAt: string
// }
//
// export const AuthSchema = new Schema<IAuth>(
//     {
//         token: { type: String, required: true, unique: true },
//         deviceId: { type: String, required: true, unique: true },
//         user: {
//             userId: { type: String, required: true },
//             userLogin: { type: String, required: true },
//         },
//         expireAt: { type: String, default: () => new Date().toISOString() },
//         issuedAt: { type: String, default: () => new Date().toISOString() },
//     },
//     { versionKey: false , _id: true}
// );