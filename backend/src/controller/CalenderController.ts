import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Calender } from "../entity/Calender"
import { CalenderModel } from "../model/CalenderModel"
import { User } from "../entity/User"
import { CalenderUserModel } from "../model/CalenderUserModel"

export class CalenderController {

    private calenderRepository = AppDataSource.getRepository(Calender)
    private userRepository = AppDataSource.getRepository(User)
    //! ALL
    async all(request: Request, response: Response, next: NextFunction) {
        const calenders = await this.calenderRepository.find({
            relations: {user: true},
            select: {
                id: true,
                calenderType: true,
                title: true,
                description: true,
                user: { id: true, firstName: true, lastName: true },
                participants: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        })
        
        return { data: calenders, status: calenders.length > 0 }
    }
    //! ONE
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const calender = await this.calenderRepository.findOne({
            where: { id }
        })

        return {
            data: calender,
            status: calender ? true : false,
            message: calender ? "" : "empty calender"
        }
    }
    //! SAVE
    async save(request: Request, response: Response, next: NextFunction) {
        const {  
            calenderType,
            title,
            description,
            traits, // bu alanı json olarak kaydedebiliriz ve daha sonra kullanabiliriz.
            userId,
            participants // partipants: [1, 2, 3, 4, 5] şeklinde bir array olabilir.
        }: CalenderModel = request.body;

        const calender = Object.assign(new Calender(), {
            calenderType,
            title,
            description,
            traits,
            user: userId,
            participants
        })

        try {
            const insert = await this.calenderRepository.save(calender) //! HEM KAYIT YAPAR HEM DÖNER
            return { data: insert, status: true }  
        } catch (error) {
            next({ error, status: 404 })
        }
    }
    //! UPDATE
    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const { } = request.body;

        try {
            const update = await this.calenderRepository.update({ id }, {

            })
            return { data: update, status: update.affected > 0 } //! affected > 0 ise true döner ve güncelleme işlemi başarılıdır.
        } catch (error) {
            next({ error, status: 404 })
        }
    }
    //! REMOVE
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let calenderToRemove = await this.calenderRepository.findOneBy({ id })

        if (!calenderToRemove) {
            return { message: "this calender not exist", status: false }
        }

        await this.calenderRepository.remove(calenderToRemove)

        return { message: "calender has been removed", status: true }
    }

}