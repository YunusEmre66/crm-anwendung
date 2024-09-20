import { AppDataSource } from "../data-source";
import { Log } from "../entity/Log";

//! Refactoring işlemi yapılırken LogSave fonksiyonu utility klasörüne taşındı.

export const LogSave = (userId: Number, process: String, type: String) => { //! bu parametreler ile log kaydı yapılır.
    console.log('test log işlemi');
    const logRepository = AppDataSource.getRepository(Log)
    const log = Object.assign(new Log(), {
        type,
        process,
        user: userId
    })

    logRepository.save(log)
}

exports.module = { LogSave }