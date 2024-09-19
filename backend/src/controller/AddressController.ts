import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Address } from "../entity/Address"
import { AddressModel } from "../model/AddressModel"

export class AddressController {
    private addressRepository = AppDataSource.getRepository(Address)
    
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
}

//!all

