import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Task } from "../entity/Task";
import { TaskStatus } from "../enum/TaskStatus";
import { Log } from "../entity/Log";
import { getUserFromJWT } from "../utility/getUserIdFromJWT";

export class TaskController {
  private taskRepository = AppDataSource.getRepository(Task);

  //! bütün task bilgileri geliyor kullanıcıların, bunu dene db de oluştur birden fazla
//! ALL
  async all(request: Request, response: Response, next: NextFunction) {
    const tasks = await this.taskRepository.find({
      relations: { user: true, responsible: true }, //! user olursa bütün user bilgilerini getirir, select ile biz ona sınır koyarız
      select: {
        //! selecti kullanmak için relations kullanmak zorundayız
        id: true,
        type: true,
        title: true,
        description: true,
        user: { id: true, firstName: true, lastName: true }, //! user içindeki id, firstName, lastName getirir, sadece user : true yazarsak bütün user bilgilerini getirir
        responsible: { id: true, firstName: true, lastName: true }, //! responsible içindeki id, firstName, lastName getirir  sadece responsible : true yazarsak bütün responsible bilgilerini getirir
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return { data: tasks, status: tasks.length > 0 }; //! tasks.length > 0 demek tasks varsa true döndür, yoksa false döndür
  }
  //! ONE
  async one(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    //! bir tane task bilgisi geliyor

    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { user: true, responsible: true },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        user: { id: true, firstName: true, lastName: true },
        responsible: { id: true, firstName: true, lastName: true },
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return {
      data: task,
      status: task ? true : false,
      message: task ? "" : "empty task",
    }; //! task varsa true döndür, yoksa false döndür, ternary if kullanımı : condition ? true : false
  }
  //! SAVE
  async save(request: Request, response: Response, next: NextFunction) {
    const { type, title, description, userId, responsibleId, status } =
      request.body;

    const task = Object.assign(new Task(), {  //! oluşturma 
      type,
      title,
      description,
      user: userId,
      responsible: responsibleId,
      status,
    });

    try {
      const insert = await this.taskRepository.save(task); //! geriye döndürme
      return { data: insert, status: true };
    } catch (error) {
      next({ error, status: 404 });
    }
  }
    //! UPDATE
  async update(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);
    const { type, title, description, userId, responsibleId, status } =
      request.body;

    try {
      const update = await this.taskRepository.update(
        { id },
        {
          type,
          title,
          description,
          user: userId,
          responsible: responsibleId,
          status,
        }
      );
      return { data: update, status: update.affected > 0 };
    } catch (error) {
      next({ error, status: 404 });
    }
  } 
    //!NEXT

  async next(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    try {
      const update = await this.taskRepository.update(
        { id },
        {
          status: TaskStatus.IN_PROGRESS, //! görev durumu IN_PROGRESS olarak değiştirilir. enuma bağladığımızdan dolayı TaskStatus.IN_PROGRESS şeklinde yazılır.
        }
      );

      const user: any = await getUserFromJWT(request); //! jwt den gelen user bilgisi alınır 
      console.log(user);

      const logRepository = AppDataSource.getRepository(Log);
      const log = Object.assign(new Log(), { 
        type: "task",
        process: "görev çalışmaya başlandı >>> ",
        user: user.id,
      });

      logRepository.save(log);

      return { data: update, status: update.affected > 0 };
    } catch (error) {
      next({ error, status: 404 });
    }
  }
 //! REMOVE
  async remove(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    let taskToRemove = await this.taskRepository.findOneBy({ id });

    if (!taskToRemove) {
      return { message: "this task not exist", status: false };
    }

    await this.taskRepository.remove(taskToRemove); //! silme işlemi yapar      

    return { message: "task has been removed", status: true }; //! silme işlemi başarılı ise true döndürür
  }
}
