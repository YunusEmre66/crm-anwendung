import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response, NextFunction} from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
require('dotenv').config();
import cors = require("cors")
import {getUserFromJWT} from "./utility/getUserIdFromJWT";
import { error } from "console"

const PORT = process.env.PORT || 3000;

AppDataSource.initialize().then(async () => {

    //! create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(express.static('public '))
    app.use(cors({credentials: true}))



    app.all("*", async(request : Request, response : Response, next : express.NextFunction) => {
        console.log("bir istek yapılmıştır"); 
        if (request.url.endsWith('login') ||request.url.endsWith('/register')) {
            next();
        } else {

            try {
                const user : any =await getUserFromJWT(request) 
                if (user.confirmed ==='approval' || user.confirmed === 'email') {
                    if (request.url.endsWith('is-login')) {
                        response.status(200).json({status:true})
                    } else {
                        next()
                    }
                } else {
                    response.status(401).json ({status :false, message : "Autorisierungsfehler. Bitte wenden Sie sich an den Administrator."})
                }
            } catch (error :any) {
                response.status(401).json ({ status : false, message : error.message})
                
            }
            
        }
    })

    //! register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    app.use((error: any, request: Request, response: Response, next: NextFunction) => {
        return response.status(error.status).json({  
            status: false,  
            code: error.error.code, 
            errno: error.error.errno,
            message: error.error.message 
        })
     })

    

    //! start express server
    app.listen(PORT)

    // insert new users for test
    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            firstName: "Timber",
            lastName: "Saw",
            age: 27
        })
    )

    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            firstName: "Phantom",
            lastName: "Assassin",
            age: 24
        })
    )

    console.log("Express server has started on port 3000. Open http://localhost:3055/users to see results")

}).catch(error => console.log(error))
