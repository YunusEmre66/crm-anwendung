import { Entity, Column, CreateDateColumn, DeleteDateColumn, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, AfterInsert } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "./User"; // User sınıfını doğru dosyadan import edin
import { ContactEnum } from "./ContactEnum"; // ContactEnum sınıfını doğru dosyadan import edin
import { Log } from "./Log"; // Log sınıfını doğru dosyadan import edin

@Entity()
export class Phone {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: ContactEnum, default: ContactEnum.HOME, nullable: false })
    phoneType: ContactEnum;

    @Column({ type: "varchar", length: 20, nullable: false })
    phoneNumber: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: "userId" })
    user: User;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @AfterInsert()
    async userLog() {
        const logRepository = AppDataSource.getRepository(Log);
        const log = Object.assign(new Log(), {
            type: 'phone',
            process: 'phone Info',
            user: this.user
        });

        await logRepository.save(log);
    }
}