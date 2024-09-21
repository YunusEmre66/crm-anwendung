import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { UserModel } from "../model/UserModel"
import { RegisterModel } from "../model/RegisterModel"
import { Email } from "../entity/Email"
import { Phone } from "../entity/Phone"
import { Address } from "../entity/Address"
import { CreatedAt } from "sequelize-typescript"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private emailRepository = AppDataSource.getRepository(Email)
    private phoneRepository = AppDataSource.getRepository(Phone)
    private addressRepository = AppDataSource.getRepository(Address)


    //! all
    async all(request: Request, response: Response, next: NextFunction) {
        const users: Array<UserModel> = (await this.userRepository.find()).map((k: UserModel) => {
            return {
                id: k.id,
                firstName: k.firstName,
                lastName: k.lastName,
                email: k.email,
                role: k.role,
                confirmed: k.confirmed,
                createdAt: k.createdAt
            } as UserModel  //! modelleri girdikten sonra k. içindeki veriler hazır olarak dönüyor.  
        })

        return { status: true, data: users }
    }

    //!one

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return {
            status: true, data: {
                firstName: user.firstName, lastName: user.lastName,
                email: user.email,
                role: user.role,
                confirmed: user.confirmed,
                createdAt: user.createdAt
            } as UserModel
        }
    }
    //!save
    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, email, password }: RegisterModel = request.body;

        const user = Object.assign(new User(), {
            firstName,
            lastName,
            email,
            password
        })

        return this.userRepository.save(user)
    }
    //! newUser
    async newUser(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

}