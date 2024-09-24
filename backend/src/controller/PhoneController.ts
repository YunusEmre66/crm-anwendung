import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Phone } from "../entity/Phone"
import { PhoneModel } from "../model/PhoneModel"
// işe önce postman, sonra route en son buradan başlayabilirsin


export class PhoneController {

    const phoneRepository = AppDataSource.getRepository(Phone)


    async all(request: Request, response: Response, next: NextFunction) {

        const phones: PhoneModel[] = await this.phoneRepository.find({
            relations: { user: true },
            
        })
    }


}