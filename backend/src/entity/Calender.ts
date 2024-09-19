import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, AfterInsert, AfterLoad, In, } from "typeorm";
import { User } from "./User";
import { AppDataSource } from "../data-source";
import { Log } from "./Log";
import { CalenderEnum } from "../enum/CalenderEnum";
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

participantsUser: User[];


participants: User[];

participantsUser: User[] = [];

@AfterLoad()
async afterLoad() {
    if (this.participants && this.participants.length > 0) {
        console.log("participantsUser", this.participants);
        const participants = this.participants.map((participant: any) => participant.id);
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find({
            where: { id: In(participants) },
            select: ["id", "firstName", "lastName"],
        });
        this.participantsUser = users;
    } else {
        this.participantsUser = [];
    }
}
}