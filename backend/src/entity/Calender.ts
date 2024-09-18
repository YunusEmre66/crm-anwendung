import { AfterInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AppDataSource } from "../data-source";


@Entity()

export class Calender {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: CalenderEnum, default: CalenderEnum.MEETING, nullable: false })

    calenderType: CalenderEnum;

    @Column({ type: "varchar" length: 250, nullable: false })
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "json" })
    traits: object;

    @ManyToOne(() => User, (user) => user.id, { nullable: false })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column({ type: "json", nullable: true: })
    participants: Number[]; //teilnehmer

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn({ nullable: true })
    updateAt; Date

    @DeleteDateColumn({ nullable: true })
    deleteAt; Date

    @AfterInsert(
        async userLog()
        const logRepository = AppDataSource.getRepository(Log);

    const log = Object.assign(new Log(), {
        type: "calender",
        process: "new celender information",
        user: this.user,
    });

        await logRepository.save(log)
    )





}