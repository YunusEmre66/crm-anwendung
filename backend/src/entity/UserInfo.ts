import { AfterInsert, CreateDateColumn, DeleteDateColumn, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AppDataSource } from "../data-source";



@Entity("user_Info")

export class UserInfo {
    @PrimaryGeneratedColumn()
    id:number 

    @OneToOne(() => User, (user) => user.id, {onDelete: "CASCADE", nullable: false})
    @JoinColumn({ name: "userId"})
    user: User

    @CreateDateColumn({ nullable: false})
    createAt :Date;

    @UpdateDateColumn({ nullable: false})
    updateAt : Date;

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