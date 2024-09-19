import { TaskEnum } from "../enum/TaskEnum";
import { TaskStatus } from "../enum/TaskStatus";


export type TaskModel = {
    id: number;
    type: TaskEnum;
    title: string;
    description: string;
    userId: number;
    responsibleId: Number;
    status: TaskStatus;
}