import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { Email } from "../entity/Email"
import { Phone } from "../entity/Phone"
import { Address } from "../entity/Address"
import { UserModel } from "../model/UserModel"


export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private emailRepository = AppDataSource.getRepository(Email)
    private phoneRepository = AppDataSource.getRepository(Phone)
    private addressRepository = AppDataSource.getRepository(Address)


    async all(request: Request, response: Response, next: NextFunction) {
        //! buradan devam
    }

    //! all

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, age } = request.body;

        const user = Object.assign(new User(), {
            firstName,
            lastName,
            age
        })

        return this.userRepository.save(user)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

}