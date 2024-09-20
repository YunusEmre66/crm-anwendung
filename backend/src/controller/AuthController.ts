import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { LoginModel } from "../model/LoginModel";
import * as bcrypt from 'bcrypt';




export class AuthController {


    private userRepository = AppDataSource.getRepository(User)


    async login(request: Request, response: Response, next: NextFunction) {
        const { email, password }: LoginModel = request.body;


        const user = this.userRepository.findOne({
            where: { email }
        })

        if (user) {
            const isValid = await bcrypt.compare(password, user.password) 
        }
    }
}