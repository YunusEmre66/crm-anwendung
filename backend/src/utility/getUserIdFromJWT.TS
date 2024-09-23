import { Request } from "express"
import jwt = require('jsonwebtoken')
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"

//! refactoring işlemi yapılırken getUserFromJWT fonksiyonu utility klasörüne taşındı.

export const getUserFromJWT = async (request: Request) => { //! burdaki request cevap döndürme işlemi yapar. öbür tarafta yazdığımızda requesti alırız.


    const token = request.headers.authorization.replace('Bearer ', '')  //! token bilgisini alıyoruz VE Bearer kısmını siliyoruz 
    const verify = jwt.verify(token, "secret") //! tokeni verify ediyoruz, DOĞRU MU YANLIŞ MI 
    const decode: any = verify ? jwt.decode(token) : null //! tokeni decode ediyoruz, decode işlemi token içindeki verileri almak için kullanılır 
    const email = decode.data.email; //! token içindeki email bilgisini alıyoruz 

 
    const userRepository = AppDataSource.getRepository(User)  //! veritabanındaki user bilgilerini alıyoruz 
    const user = await userRepository.findOne({  //! email değerine göre user bilgilerini alıyoruz db.den. sonra bu bilgileri dönüyoruz. email varsa user bilgilerini dönüyoruz.
        where: { email }
    })

    return user
}
module.exports = { getUserFromJWT }  //! fonksiyonu dışarı aktarıyoruz.artık istediğimiz yerde kullanabiliriz.