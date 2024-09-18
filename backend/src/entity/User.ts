import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsDefined, IsEmail, Length } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    @IsDefined({ message: "Vorname ist erforderlich." })
    @Length(3, 100)
    firstName!: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    @IsDefined({ message: "Nachname ist erforderlich" })
    @Length(3, 100)
    lastName!: string;


    @Column({ type: "varchar", length: 100, unique: true })
    @IsEmail()
    email: string;

    @Column()
    @IsDefined({ message: "Password ist erforderlich" })
    @Length(6, 100)
    password: string;

    @Column({type:"enum", enum: UserRoleEnum, default:UserRoleEnum.USER, nullable :false})
    role:UserRoleEnum;

    @Column({type:"enum", enum:UserConfirmedEnum, default:UserConfirmedEnum.PENDING, nullabla:false})
    confirmed: UserConfirmedEnum;

    @OneToMany(() => Phone, (phone) => phone.user, {cascade: true})







}
