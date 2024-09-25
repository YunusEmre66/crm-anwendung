import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response, NextFunction, ErrorRequestHandler } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
require('dotenv').config();
import cors = require("cors")
import { getUserFromJWT } from "./utility/getUserIdFromJWT"

AppDataSource.initialize().then(async () => {
    // test
    // create express app
    const app = express()
    app.use(express.json());
    app.use(bodyParser.json())
    app.use(express.static('public'))
    app.use(cors({ credentials: true }))  //! olmazsa olmaz 

    // app.get('/api/user(s)?|(user-)?list|ab+', async (req: Request, res: Response) => {
    //     res.send('Hello World!')   
    // })
    // /api/users
    // /api/user-list

    // app.get(/^\/api\/doc(s|umentation)$/, async (req: Request, res: Response) => {  
    //     res.send('Hello World!')   
    // })
    // /api/docs
    // /api/documentation

    // app.get('/api/user/:year([0-9]{4})-:month([0-9]{2})-:day([0-9]{2})', async (req: Request, res: Response) => {//! TARİHİNİ GÖSTERİR
    //     console.log(req.params.month);
        
    //     res.send(req.params)   
    // })
    // /api/user/2023-12-18x

    //! İLK GİRİŞ 

    //! app.all ile tüm istekleri yakalayabiliriz. controllera gitmeden önce burdaki route işlemlerini yapabiliriz.c
    //! * ile tüm istekleri yakalayabiliriz. controllera gitmeden önce burdaki route işlemlerini yapabiliriz.


    app.all('*', async (request: Request, response: Response, next: NextFunction) => { //! burdaki all = get,post,put,delete işlemlerini yapabiliriz. * işareti her urlye karşılık gelioyor
        console.log('bir istek yapıldı'); //! projem çalıştığında console log kısmına bir istek yapıldı yazısını yazdırır.
        if (request.url.endsWith('/login') || request.url.endsWith('/register')) {  //! login ve register işlemlerinde yetkilendirme yapmadık. çünkü kullanıcı henüz giriş yapmadı. yetkilendirme için token oluşturmadık.
            next()  //! next : bir sonraki işlemi yapar. bu işlemden sonra aşağıda ki foreach bloğu çalışır, oradan controllera gider. EĞER /is-login ise ....
        } else {

            //! YETKISI VARSA İŞLEM YAPABİLİR. EMAIL VE ONAY DURUMUNA GÖRE İŞLEM YAPABİLİR. ARTIK LOGIN OLMUŞ OLAN KULLANICI İŞLEM YAPABİLİR.
            try {
                const user: any = await getUserFromJWT(request)  //! user bilgisi oradan döndüğü an aşağıdaki işlemleri yapar.

                if (user.confirmed === 'approval' || user.confirmed === 'email') {  //! kullanıcı onaylandıysa veya email onayı yapıldıysa işlem yapabilir. 
                    if (request.url.endsWith('/is-login')) {
                        response.status(200).json({ status: true })
                    } else {
                        next()
                    }
                } else {
                    response.status(401).json({ status: false, message: 'yetkilendirme hatası. lütfen yöneticiye danışın' }) //! ÖNCEKİ HALİ PENDİNG Dİ BUNUN
                }
            } catch (error: any) {
                response.status(401).json({ status: false, message: error.message })
            }
        }
    })

    // register express routes from defined application routes

    //! 2.GİRİŞ, ROUTE İŞLEMLERİNİN KISA YOLU, İSVİÇRE ÇAKISI GİBİ BİR YAPI
    //! get post işlemlerinin hepsini yapabilmek için aşağıdaki kodu yazdık

    Routes.forEach(route => {
        //! url : /api/v1/user , /api/v1/user/:id , 
        //! route.method : get, post, put, delete , 
        //!route.route : /user , /user/:id
        (app as any)[route.method](`/api/v1${route.route}`, async (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {  //!é promise ise then ile result döndür ve sonucu gönder
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)
            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })
    //! 3.GİRİŞ-- bu kısım kafamda tam oturmadı. üzerinde durulabilir.
    app.use((error: any, request: Request, response: Response, next: NextFunction) => { //! .use ile hata durumunda çalışacak fonksiyonu yazdık. app.use : tüm hataları yakalar
        return response.status(error.status).json({  //! hata durumunda status ve message döndür. bu hatalar mysql hataları
            status: false,  //! status: hata durumu false olacak
            code: error.code,  //! code: mysql hata kodu
            errno: error.errno, //! errno: mysql hata kodu 
            message: error.message //! message: mysql hata mesajı 
        })
     })

    // start express server

    //! env dosyasınınn çalışması için dotenv paketini yüklememiz gerekiyor. ayrıca .env dosyası oluşturup içine PORT=3000 yazmamız gerekiyor.
    //!process.env.PORT ile port numarasını alıyoruz.
    app.listen(process.env.PORT)
    console.log("Express server has started on port " + process.env.PORT)
}).catch(error => console.log(error))
