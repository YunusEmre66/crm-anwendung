import { AppDataSource } from "../data-source";


export const LogSave = async (userId: Number, process: String, type: String): Promise<void> => { //! tip belirliyoruz parametrelere
    console.log('test log işlemi')
    const logRepository = AppDataSource.getRepository(Log)
    const log = Object.assign(new Log(), {
        type,
        process,
        user: userId
    })


}

exports.module = { LogSave }