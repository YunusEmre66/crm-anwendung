import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, AfterInsert } from "typeorm"
import { User } from "./User"
import { AppDataSource } from "../data-source"
import { Log } from "./Log"
import { TaskEnum } from "../enum/TaskEnum"
import { TaskStatus } from "../enum/TaskStatus"
@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: TaskEnum, default: TaskEnum.STANDART, nullable: false })
    type: TaskEnum;

    @Column({ type: 'varchar', length: 250, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => User, (user) => user.id, { nullable: false })
    user: User;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "responsibleId" })
    responsible: User;

    @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.APPOINTED, nullable: false })
    status: TaskStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updateAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;

    @AfterInsert()
    async userLog() {
        const logRepository = AppDataSource.getRepository(Log);
        const log = Object.assign(new Log(), {
            type: 'task',
            process: 'wurde task gegeben ' + this.responsible,
            user: this.user
        });
        await logRepository.save(log);
    }
}