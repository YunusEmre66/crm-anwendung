import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { UserModel } from "../model/UserModel"
import { RegisterModel } from "../model/RegisterModel"
import { Email } from "../entity/Email"
import { Phone } from "../entity/Phone"
import { Address } from "../entity/Address"
import { CreatedAt } from "sequelize-typescript"
import { request } from 'http';

export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private emailRepository = AppDataSource.getRepository(Email)
    private phoneRepository = AppDataSource.getRepository(Phone)
    private addressRepository = AppDataSource.getRepository(Address)


    //! all
    async all(request: Request, response: Response, next: NextFunction) {
        const users: Array<UserModel> = (await this.userRepository.find()).map((k: UserModel) => {
            console.log(users)
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

        const { firstName, lastName, email, emailType, phone, phoneType, addressType, addressLine,
            location, country, city, district, town
        } = request.body;

        const user = Object.assign(new User(), {
            firstName: firstName,
            lastName,
            email,
            password: (Math.random() * 1000000).toFixed(0)
        })

        try {
            const insert = await this.userRepository.save(user);
            const userId = insert.id

            const newEmail = Object.assign(new Email(), {
                emailType: emailType,
                emailAddress: email,
                user: userId
            })

            await this.emailRepository.save(newEmail)

            const newPhone = Object.assign(new Phone(), {
                phoneType: phoneType,
                phoneNumber: phone,
                user: userId
            })

            await this.phoneRepository.save(newPhone)

            const newAddress = Object.assign(new Address(), {
                addressType,
                addressLine,
                location,
                user: userId,
                country,
                city,
                district,
                town
            })
            await this.addressRepository.save(newAddress)

            return {
                data: {
                    firstName: insert.firstName,
                    lastName: insert.lastName,
                    email: insert.email,
                    role: insert.role,
                    confirmed: insert.confirmed,
                    createdAt: insert.createdAt
                } as UserModel, status: true
            }
        } catch (error) {
            if (error.code === undefined) {
                error.message = error.map((k: any) => {
                    return { constraints: k.constraints, property: k.property }
                })
            }
            next({ error, status: 404 })
        }
    }

    //! update 
    async update(request: Request, respnse: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const { firstName, lastName } = request.body;

        const update = await this.userRepository.update({ id }, {
            firstName,
            lastName
        })
        return { update, status: true }
    }

    //!remove 
    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const id = parseInt(request.params.id);
            if (isNaN(id)) {
                return response.status(400).json({ status: false, message: 'Invalid ID' });
            }
    
            let userToRemove = await this.userRepository.findOneBy({ id });
            if (!userToRemove) {
                return response.status(404).json({ status: false, message: 'User not found' });
            }
    
            await this.userRepository.remove(userToRemove);
    
            return response.json({ message: "User has been removed", status: true });
        } catch (error) {
            next(error); // Hata durumunda hata yönetimi middleware'ine yönlendirin
        }
    }

}

//! 