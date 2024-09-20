import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import * as bcrypt from 'bcrypt';
import jwt = require('jsonwebtoken')
import { UserModel } from "../model/UserModel";
import { RegisterModel } from "../model/RegisterModel";
import { LoginModel } from "../model/LoginModel";
import { ResponseLoginModel } from "../model/ResponseLoginModel";
import { getUserFromJWT } from "../utility/getUserIdFromJWT";
import { newUser } from "../utility/new-user";
import { LogSave } from "../utility/log-save";

//! lOGIN  REGISTER İŞLEMLERİ 


export class AuthController {

    private userRepository = AppDataSource.getRepository(User)              //! User entitysini kullanabilmek için userRepository değişkenine atıyoruz.
    //! BU KISIMDA usera ait her bilgi alınabilir. user.firstName, user.lastName, user.email, user.password, user.role, user.confirmed, user.createdAt
    

    //! LOGIN 
    async login(request: Request, response: Response, next: NextFunction) {
        const { email, password }: LoginModel = request.body;             //! LoginModel içindeki email ve password değerlerini alıyoruz.

        const user = await this.userRepository.findOne({                //! email değerine göre user bilgilerini alıyoruz.
            where: { email }
        }) 

        if (user) {  //! eğer user bilgileri varsa aşağıdaki işlemleri yapacak.
            const isValid = await bcrypt.compare(password, user.password)  //! Girilen şifre ile db deki şifreyi karşılaştırıyoruz. Eğer eşleşirse isValid true olacak. bcrypt.compare: şifreyi çözerek karşılaştırma yapar.
            if (isValid) {                                                  //! Eğer isValid true ise aşağıdaki işlemleri yapacak.
                const loginUser: ResponseLoginModel = { //! model içindeki özellikleri alıyoruz. bu özellikler dışında bir şey girilirse hata verir.

                    //! aşağıdaki şekilde biz password ve id gibi bilgileri dışarıya vermiyoruz. güvenlik açısından önemli. 
                    //! dto : data transfer object , yani veri transfer objesi. burada sadece gerekli olan bilgileri dışarıya veriyoruz.
                    //! tümden varım, tüme varım mantığı.
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    confirmed: user.confirmed

                    //! ilk önce pending olan bir kullanıcı oluşturulur. daha sonra kullanıcı mailine gelen linke tıkladığında confirmed true olur.
                    //! pending işleminde login dooğrulama işlemi olur ama email onayı olmadan içeriye giremez. örneğin : facebook, instagram
                }

                // 
                //! BANKA gibi yerlerde token süresi 5 dakikadır
                const token = jwt.sign({ //! bu işlem token sağlar. 
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, //! token süresi : 24 saat, 60 saniye * 60 dakika * 24 saat
                    data: loginUser,  //! tokenın içine yukarıda aldığımız data bilgiside geliyor
                }, "secret")

                LogSave(user.id, 'Login İşlemi Yapıldı', 'user')  //! utility klasöründeki log-save fonksiyonu ile log kaydı yapılır. 
 
                return { status: true, token, user: loginUser }   //! token ve user bilgilerini döndürüyoruz. status true olacak. status bilgisi frontendçiler için önemli.
            } else {
                const error: any = new Error("email ve/veya şifre geçersiz")
                next({ error, status: 401 }) //! 401 hata kodu : yetkisiz erişim 
            }
        } else {
            const error: any = new Error("email ve/veya şifre geçersiz") //! EĞER email bilgisi doğru değilse hata döndürür.
            next({ error, status: 401 }) //! 401 hata kodu : yetkisiz erişim
        }
    }

    //! REGISTER
    async register(request: Request, response: Response, next: NextFunction) {
        
        const body: RegisterModel = request.body; //! RegisterModel içindeki bilgileri alıyoruz. MESELA : firstName, lastName, email, password. bunların bu model içinde özellikleri var.
         
        const {res, status} = await newUser(body)  //! newUser fonksiyonu ile yeni kullanıcı oluşturulur. body içindeki bilgileri alır ve res ve status döner. 
    
        if (status) {
                return {
                firstName: res.firstName,  //! registerModel ve LoginModel den gelen 4 tane değer var. firstName, lastName, email, password. aksi bir şey girilirse kırmızı yanar.
                lastName: res.lastName,
                email: res.email,
                role: res.role,
                confirmed: res.confirmed,
                
            } as UserModel  //! UserModel içindeki özellikleri döndürüyoruz. 
        } else {
            next({ error: res, status: 404 })  //! next : bir sonraki işlemi yapar. bu işlemden sonra aşağıda ki foreach bloğu çalışır, oradan controllera gider.
        }
    }
        //const { firstName, lastName, email, password }: RegisterModel = request.body; //! bu farklı bir yapı yukarıdaki örneğe göre. mantık aynı
        
        // const {firstName, lastName, email, password}  = request.body as RegisterModel; //! bu da aynı mantık yukarıdakiyle 

        // const user = Object.assign(new User(), {
        //     firstName,
        //     lastName,
        //     email,
        //     password
        // })

        // const body: RegisterModel = request.body;

        // const user = Object.assign(new User(), {
        //     firstName: body.firstName,
        //     lastName: body.lastName,
        //     email: body.email,
        //     password: body.password
        // })

        // try {
        //     const insert = await this.userRepository.save(user)

        //     return {
        //         firstName: insert.firstName,
        //         lastName: insert.lastName,
        //         email: insert.email,
        //         role: insert.role,
        //         confirmed: insert.confirmed,
        //     } as UserModel
        // } catch (error: any) {
        //     if (error.code === undefined) {
        //         error.message = error.map((k: any) => {
        //             return { constraints: k.constraints, property: k.property }
        //         })
        //     }

        //     next({ error, status: 404 })
        // }
    //! UPDATE
    async update(request: Request, response: Response, next: NextFunction) {
        const user: any = await getUserFromJWT(request)  //! token,decode, verify vs işlemleri hepsi getUserFromJWT fonksiyonunda yapılır. request getuserfromjwt fonksiyonuna gider ve user bilgilerini döner.

        const id = user.id
        const { firstName, lastName }: RegisterModel = request.body;

        try {
            const update = await this.userRepository.update({ id }, { firstName, lastName })  //! üst satırdan geliyor. id ve firstName, lastName bilgilerini alıyoruz.
            return { status: true, update }
        } catch (error: any) {
            next({ error, status: 404 }) 
        }
    }
    //! CHANGE PASSWORD
    async changePassword(request: Request, response: Response, next: NextFunction) {  //! senaryo : önce eski şifre girilir, sonra yeni şifre girilir. ikiside doğru ise şifre değiştirilir. 
        const user: any = await getUserFromJWT(request)

        const id = user.id
        const { oldPassword, newPassword } = request.body;

        const isValid = await bcrypt.compare(oldPassword, user.password) //! eski şifre(aktif olan yani), db deki şifre ile aynı olmalı ki değişiklik yapabilelim

        if (isValid) {  //! true olduğunda bu durumda yeni şifreyi bcrypt ile şifreleyip db ye kaydediyoruz.
            const newPasswordBcrypt = await bcrypt.hash(newPassword, 10)
            const update = await this.userRepository.update({ id }, { password: newPasswordBcrypt })
            return { status: true, update }
        } else {
            const error: any = new Error("şifre geçersiz")
            next({ error, status: 404 })
        }
    }
}