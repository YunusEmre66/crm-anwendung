import { Request } from "express";
import jwt = require('jsonwebtoken')
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";




export const getUserFromJWT = async (request: Request) => {

    const token = request.headers.authorization.replace('Bearer', '')  //! token bilgisini alıyoruz VE Bearer kısmını siliyoruz, token bilgilisini burada frontend mi gönderiyor
    const verify = jwt.verify(token, "secret")
    const decode: any = verify ? jwt.decode(token) : null
    const email = decode.data.email;


    const userRepository = AppDataSource.getRepository(User) //!önce çağırmak gerekir User bilgisin
    const user = await userRepository.findOne({
        where: { email }
    })

    return user
}

module.exports = { getUserFromJWT}