import { length } from "class-validator";
import { AfterInsert, CreateDateColumn, DeleteDateColumn, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AppDataSource } from "../data-source";


@Entity("emails")

export class Email {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: ContactEnum, default: ContactEnum.HOME, nullable: false })
    emailtype: ContactEnum

    @Column({ type: 'varchar', length: 100, nullable: false })
    emailAddress: string

    @ManyToOne(() => User, (user) => user.id, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({ name: "userId"})
    user: User

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt:Date

    @DeleteDateColumn()
    deleteAt: Date 

    @AfterInsert()
    async userLog() {
        const logRepository = AppDataSource.getRepository(Log)
        const log = Object.assign(new Log(), {
            type: 'email',
            process: 'Address Info'
        })
    }
}
