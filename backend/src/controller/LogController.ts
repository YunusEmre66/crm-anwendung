import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Log } from '../entity/Log';

export class LogController {
    private logRepository = AppDataSource.getRepository(Log);
    //!all
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const logs = await this.logRepository.find();
            response.json(logs);
        } catch (error) {
            next(error);
        }
    }
    //!one

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const log = await this.logRepository.findOne({
            where: { id }
        })

        if (!log) {
            return "unregistered log"
        }
        return log
    }
    //!save
    async save(request: Request, response: Response, next: NextFunction) {
        const { } = request.body;

        const log = Object.assign(new Log(), {

        })

        return await this.logRepository.save(log)
    }  //! elle log kaydetme çok mantıklı bir hareket gibi durmuyor, zaten request.body içine bir değer de almıyor

    //! update
    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const { } = request.body
        return await this.logRepository.update({ id }, {

        })
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)  //! url den gelen string ifadeyi integere çevirir, okunabilecek hale getirir 

        let logToRemove = await this.logRepository.findOneBy({ id })

        if (!logToRemove) {
            return "this log not exist"
        }

        await this.logRepository.remove(logToRemove)
        return "log has been removed"
    }

}