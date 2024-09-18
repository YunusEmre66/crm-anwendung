import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()

export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "enum", enum: TaskEnum, default: TaskEnum.STANDART, nullable:false})
    type: TaskEnum

    @Column({TYPE: '
        '})
}