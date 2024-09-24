import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Address } from "../entity/Address"
import { AddressModel } from "../model/AddressModel"

export class AddressController {


    private addressRepository = AppDataSource.getRepository(Address)
    //! ALL


    async all(request: Request, response: Response, next: NextFunction) {
        const addresses: AddressModel[] = await this.addressRepository.find({
            relations: { user: true }, //! user : true  bütün user bilgilerini getirir, select ile biz ona sınır koyarız
            select: {
                id: true,
                addressType: true,
                addressLine: true,
                location: true,
                user: { id: true, firstName: true, lastName: true } //! user içindeki id, firstName, lastName getirir, 
            }
        })

        //!select anahtar kelimesi, hangi alanların seçileceğini belirtir. Bu örnekte, id, addressType, addressLine, location ve user alanları seçilmiştir. user alanı içinde ise id, firstName ve lastName alanları seçilmiştir. Bu, sadece gerekli alanların getirilmesini sağlar ve veritabanı sorgusunun performansını artırır.

        return { data: addresses, status: true }
    }
    //! ONE
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const address = await this.addressRepository.findOne({
            where: { id },
            relations: { user: true },
            select: {
                id: true,
                addressType: true,
                addressLine: true,
                location: true,
                user: { id: true, firstName: true, lastName: true }
            }
        })

        if (!address) {
            return { message: "unregistered address", status: false }
        }
        return { data: address, status: true }
    }
    //! SAVE
    async save(request: Request, response: Response, next: NextFunction) {
        const { userId, addressType, addressLine, location } = request.body;

        const address = Object.assign(new Address(), {
            user: userId,
            addressType,
            addressLine,
            location
        })

        try {
            const insert = await this.addressRepository.save(address)
            return { data: insert, status: true }
        } catch (error) {
            next({ error, status: false })
        }
    }
    //! UPDATE
    async update(request: Request, response: Response, next: NextFunction) {

        //! UPDATEDE 2 TANE FARKLI YERDEN VERİ ALINACAK. 1. ID 2. BODY

        const id = parseInt(request.params.id)
        const { userId, addressType, addressLine, location } = request.body;

        try {
            const update = await this.addressRepository.update({ id }, {
                user: userId,
                addressType,
                addressLine,
                location
            })
            return { data: update, status: update.affected > 0 }
        } catch (error) {
            next({ error, status: 404 })
        }
    }
    //! REMOVE
    async remove(request: Request, response: Response, next: NextFunction) { //! url den gelen id ye göre address silinecek.
        const id = parseInt(request.params.id)

        let addressToRemove = await this.addressRepository.findOneBy({ id })  //! id ye göre silinecek address bulunuyor.

        if (!addressToRemove) {
            return { message: "this address not exist", status: false } //! bulamadığı için silemedi, başarısz
        }

        await this.addressRepository.remove(addressToRemove)

        return { message: "address has been removed", status: true } //! başarılı , silindi
    }
}