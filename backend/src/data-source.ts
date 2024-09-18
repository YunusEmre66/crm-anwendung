import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
require('dotenv').config();  //!.env çalışması için gerekli . npm i dotenv --save komutu ile yüklenir.

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),  //! portu integer yapar
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,  //!.env dosyasında tanımlı olan değişkenler 
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})

