import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import * as dotenv from 'dotenv';
dotenv.config();
import cors = require("cors");
import { getUserFromJWT } from "./utility/getUserIdFromJWT";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize().then(async () => {

    const app = express();
    app.use(express.json());
    app.use(express.static('public'));
    app.use(cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
    }));

    app.all('*', async (request: Request, response: Response, next: NextFunction) => {
        try {
            console.log('bir istek yapıldı'); 
            if (request.url.endsWith('/login') || request.url.endsWith('/register')) {  
                next();  
            } else {
                const user: any = await getUserFromJWT(request);

                if (user.confirmed === 'approval' || user.confirmed === 'email') { 
                    if (request.url.endsWith('/is-login')) {
                        response.status(200).json({ status: true });
                    } else {
                        next();
                    }
                } else {
                    response.status(401).json({ status: false, message: 'yetkilendirme hatası. lütfen yöneticiye danışın' });
                }
            }
        } catch (error: any) {
            response.status(401).json({ status: false, message: error.message });
        }
    });

    Routes.forEach(route => {
        (app as any)[route.method](`/api/v1${route.route}`, async (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {  
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    app.use((error: any, request: Request, response: Response, next: NextFunction) => {
        const statusCode = error.status || 500;
        return response.status(statusCode).json({  
            status: false,  
            code: error.code, 
            errno: error.errno,
            message: error.message 
        });
     });

    app.listen(PORT);
    console.log(`Express server has started on port ${PORT}. Open http://localhost:${PORT}/users to see results`);

}).catch(error => console.log(error));
