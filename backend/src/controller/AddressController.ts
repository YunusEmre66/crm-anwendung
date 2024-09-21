import { AppDataSource } from "../data-source"
import { NextFunction, Request, response, Response } from "express"
import { Address } from "../entity/Address"
import { AddressModel } from "../model/AddressModel"
import { request } from "http"
import { TreeRepositoryUtils } from "typeorm"

export class AddressController {
    private addressRepository = AppDataSource.getRepository(Address)
    //!all
    async all(request: Request, response: Response, next: NextFunction) {
        const addresses: AddressModel[] = await this.addressRepository.find({
            relations: { user: true },
            select: {
                id: true,
                addressType: true,
                addressLine: true,
                location: true,
                user: { id: true, firstName: true, lastName: true }
            }
        })

        return { data: addresses, status: true }
    }

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
                user: {id: true, firstName: true, lastName: true}
            }
        })
    }

}

//!get one address


