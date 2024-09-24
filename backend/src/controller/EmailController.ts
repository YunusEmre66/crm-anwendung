import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Email } from "../entity/Email"
import { EmailModel } from "../model/EmailModel"

export class EmailController {

    private emailRepository = AppDataSource.getRepository(Email)
    //! all : tüm verileri alıyorsun
    async all(request: Request, response: Response, next: NextFunction) { //! URL: /emails GET 
        const email: EmailModel[] = await this.emailRepository.find({  //! email değişkenine emailRepository.find ile tüm email verilerini getir.
            relations: { user: true },
            select: {
                id: true,
                emailType: true,
                emailAddress: true,
                user: { id: true, firstName: true, lastName: true },
            }
        })

        return { data: email, status: true }
    }
    //! one : id ile bir veri alıyorsun
    async one(request: Request, response: Response, next: NextFunction) { //! URL: /emails/:id GET >>> one olduğu için urlden id alınıyor. all da hepsini aldığımız için find diyoruz
        const id = parseInt(request.params.id)  //!mesela id numarası 101 olmayan bir veri varsa db de hata döndürüyoruz.

        const email = await this.emailRepository.findOne({ //! findone ile sadece bir tane veri getiriyoruz.
            where: { id },
            relations: { user: true },
            select: {
                id: true,
                emailType: true,
                emailAddress: true,
                user: { id: true, firstName: true, lastName: true },
            }
        })

        if (!email) {  //! eğer id ye göre bir email bulunamazsa hata döndürüyoruz.
            return { message: "unregistered email", status: false } 
        }
        return { data: email, status: true }
    }
   //! save
    async save(request: Request, response: Response, next: NextFunction) {
        const { userId, emailType, emailAddress } = request.body;

        const email = Object.assign(new Email(), {  //! save diğerlerinden farklı olarak object assign ile yeni bir email oluşturuyoruz.
            user: userId,
            emailType,
            emailAddress
        })

        try {
            const insert = await this.emailRepository.save(email)
            return { data: insert, status: true }
        } catch (error) {
            next({ error, status: 404 })
        }
    }
    //! update
    async update(request: Request, response: Response, next: NextFunction) {
        
        //! 2 farklı yerden veri alınacak. 1. id 2. body BURASI ÖNEMLİ, altda alınan bu veriler ile update işlemi yapılacak.
        const id = parseInt(request.params.id)     //! id alınıyor   
        const { userId, emailType, emailAddress } = request.body; //! body den diğer veriler alınıyor. 

        try {
            const update = await this.emailRepository.update({ id }, {
                user: userId,
                emailType,
                emailAddress
            })
            return { data: update, status: update.affected > 0 }
        } catch (error) {
            next({ error, status: 404 })
        }
    }
    //! remove
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id) //! alınan id , daha sonra silinecek emaili bulmak için kullanılacak.

        let emailToRemove = await this.emailRepository.findOneBy({ id })

        if (!emailToRemove) { //! id yoksa hata döndürüyoruz.
            return { message: "this email not exist", status: false }
        }

        await this.emailRepository.remove(emailToRemove) //! id varsa db den siliniyor tüm satırı.

        return { message: "email has been removed", status: true }
    }
}

//! findOneby : id yi direk olarak veriyorsun {id}
//!  findOne : where :{id} ile alıyorsun 
//! find : tüm verileri alıyorsun
//! update : id ve body alıyorsun
//! remove : id alıyorsun
//! save : body alıyorsun
//! all : tüm verileri alıyorsun
//! one : id alıyorsun
