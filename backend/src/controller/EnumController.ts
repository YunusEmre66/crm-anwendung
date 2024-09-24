import { NextFunction, Request, Response } from "express";
import { TaskEnum } from "../enum/TaskEnum";
import { CalenderEnum } from "../enum/CalenderEnum";
import { ContactEnum } from "../enum/ContactEnum";
import { LogTypeEnum } from "../enum/LogTypeEnum";
import { TaskStatus } from "../enum/TaskStatus";
import { UserConfirmedEnum } from "../enum/UserConfirmedEnum";
import { UserRoleEnum } from "../enum/UserRoleEnum";

//! bu url'e gidildiğinde enum'larımızı döndüren bir controller oluşturduk 
//! http://localhost:3000/api/enum/task 
//! http://localhost:3000/api/enum/calender
//! http://localhost:3000/api/enum/contact  şeklinde gidilerek enum'larımızı görebiliriz

export class EnumController {
    async task(request: Request, response: Response, next: NextFunction) {
        return {
            data: Object.values(TaskEnum).map((item: string, index: number) => {  //! Object.values(TaskEnum) => [0: "CALL", 1: "EMAIL", 2: "MEETING", 3: "TASK"] , map => {id: "CALL", name: "CALL"} 
                return { id: item, name: item };
            }), status: true
        }
    }
    async calender(request: Request, response: Response, next: NextFunction) {
        return {
            data: Object.values(CalenderEnum).map((item: string, index: number) => {
                return { id: item, name: item };
            }), status: true
        }
    }
    async contact(request: Request, response: Response, next: NextFunction) {
        return {
            data: Object.values(ContactEnum).map((item: string, index: number) => {
                return { id: item, name: item };
            }), status: true
        }
    }
    async log(request: Request, response: Response, next: NextFunction) {
        return {
            data: Object.values(LogTypeEnum).map((item: string, index: number) => {
                return { id: item, name: item };
            }), status: true
        }
    }
    async taskStatus(request: Request, response: Response, next: NextFunction) {
        return {
            data: Object.values(TaskStatus).map((item: string, index: number) => {
                return { id: item, name: item };
            }), status: true
        }
    }
    async confirm(request: Request, response: Response, next: NextFunction) {
        return {
            data: Object.values(UserConfirmedEnum).map((item: string, index: number) => {
                return { id: item, name: item };
            }), status: true
        }
    }
    async usersRole(request: Request, response: Response, next: NextFunction) {
        return {
            data: Object.values(UserRoleEnum).map((item: string, index: number) => {
                return { id: item, name: item };
            }), status: true
        }
    }
}