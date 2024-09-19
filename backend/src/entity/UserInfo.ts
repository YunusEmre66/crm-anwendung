import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, AfterInsert } from "typeorm"
import { User } from "./User"
import { AppDataSource } from "../data-source";
import { Log } from "./Log";

@Entity("user_Info")

export class UserInfo {
    @PrimaryGeneratedColumn()
    id:number 

    @OneToOne(() => User, (user) => user.id, {onDelete: "CASCADE", nullable: false})
    @JoinColumn({ name: "userId"})
    user: User

    @CreateDateColumn({ nullable: false})
    createdAt :Date;

    @UpdateDateColumn({ nullable: false})
    updatedAt : Date;

    @DeleteDateColumn()
    deleteAt: Date;


    @AfterInsert()
    async userLog() {
        const logRepository= AppDataSource.getRepository(Log)
        const log = Object.assign(new Log(), {
            type:"user_info",
            process:"benutzer info",
            user:this.user

        })

        logRepository.save(log)
    }
}