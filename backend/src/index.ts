import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response, NextFunction} from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
require('dotenv').config();
import cors = require("cors")
import {getUserFromJWT} from "./utility/getUserIdFromJWT";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize().then(async () => {

    //! create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(express.static('public '))
    app.use(cors({credentials: true}))



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

    //! register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](`/api/v1${route.route}`, async (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {  //!é promise ise then ile result döndür ve sonucu gönder
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)
            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    app.use((error: any, request: Request, response: Response, next: NextFunction) => {
        return response.status(error.status).json({  
            status: false,  
            code: error.error.code, 
            errno: error.error.errno,
            message: error.error.message 
        })
     })

    

    //! start express server
    app.listen(PORT)

    console.log("Express server has started on port 3000. Open http://localhost:3055/users to see results")

}).catch(error => console.log(error))
