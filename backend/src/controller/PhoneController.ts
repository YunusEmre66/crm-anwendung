import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Phone } from "../entity/Phone"
import { PhoneModel } from "../model/PhoneModel"

export class PhoneController {

    private phoneRepository = AppDataSource.getRepository(Phone)

    async all(request: Request, response: Response, next: NextFunction) {
        const phones: PhoneModel[] = await this.phoneRepository.find({
            relations: { user: true }, //! user tablosu ile ilişkili olanları getirir. 
            select: { //! sadece belirtilen alanları getir ve phones değişkenine ata. bu sistem gelen verileri daraltıyor ve veriler daha hızlı geliyor. performans arttırıcı şeyler
                id: true,
                phoneType: true, //! bu kısımlar normalde string ilede geliyor "mesela" ama intelligence kullanmak her zaman daha iyidir.
                phoneNumber: true,
                user: { id: true, firstName: true, lastName: true }, //! user tablosundan sadece bu alanları getir.
            }
        })

        return { data: phones, status: true }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const phone = await this.phoneRepository.findOne({
            where: { id }, //! id si gelen id ye eşit olanı getir.
            relations: { user: true }, //! user tablosu ile ilişkili olanları getirir.
            select: { //! sadece belirtilen alanları getir ve phone değişkenine ata. bu sistem gelen verileri daraltıyor ve veriler daha hızlı geliyor. performans arttırıcı şeyler
                id: true,
                phoneType: true,
                phoneNumber: true,
                user: { id: true, firstName: true, lastName: true },
            }
        })

        if (!phone) {
            return { message: "unregistered phone", status: false } //! PHONE false olursa hata var demektir.
        }
        return { data: phone, status: true }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { userId, phoneType, phoneNumber } = request.body; //! body de aynı isimlerde kayıt yapılması lazım yoksa hata verir.

        const phone = Object.assign(new Phone(), {
            user: userId,
            phoneType,
            phoneNumber
        })

        try {
            const insert = await this.phoneRepository.save(phone)
            return { data: insert, status: true }
        } catch (error) {
            next({ error, status: 404 })
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const { userId, phoneType, phoneNumber } = request.body;

        try {
            const update = await this.phoneRepository.update({ id }, {
                user: userId,
                phoneType,
                phoneNumber
            })
            return { data: update, status: update.affected > 0 } //!affected demek : 
        } catch (error) {
            next({ error, status: 404 })
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let phoneToRemove = await this.phoneRepository.findOneBy({ id })  

        if (!phoneToRemove) {
            return { message: "this phone not exist", status: false }
        }

        await this.phoneRepository.remove(phoneToRemove)

        return { message: "phone has been removed", status: true }
    }
}