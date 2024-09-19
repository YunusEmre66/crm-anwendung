import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Email } from "./entity/Email"
import { Phone } from "./entity/Phone"
import { Address } from "./entity/Address"
import { Calender } from "./entity/Calender"
import { UserInfo } from "./entity/UserInfo"
import { Log } from "./entity/Log"
import { Task } from "./entity/Task"
import { Country } from "./entity/Country"
import { City } from "./entity/City"
import { District } from "./entity/District"
import { Town } from "./entity/Town"
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
    entities: [User,Email, Phone, Address, Calender, UserInfo, Log, Task, Country, City, District, Town],
    migrations: [],
    subscribers: [],
})

