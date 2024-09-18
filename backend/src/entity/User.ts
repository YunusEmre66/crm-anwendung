import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert } from 'typeorm';
import { IsDefined, IsEmail, Length, validateOrReject } from 'class-validator';

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

    @Column({ type: "enum", enum: UserRoleEnum, default: UserRoleEnum.USER, nullable: false })
    role: UserRoleEnum;

    @Column({ type: "enum", enum: UserConfirmedEnum, default: UserConfirmedEnum.PENDING, nullable: false })
    confirmed: UserConfirmedEnum;

    @OneToMany(() => Phone, (phone) => phone.user, { cascade: true })
    phone: Phone[]


  
    @OneToMany(() => Email, (email) => email.user, { cascade: true })
    emails: Email[]

    @OneToMany(() => Address, (address) => address.user, { cascade: true })
    address: Address[];

    @CreateDateColumn({ select: true })
    createAt: Date;

    @UpdateDateColumn({ select: true, nullable: true })
    updateAt: Date;

    @DeleteDateColumn({ select: true, nullable: true })
    deleteAt: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    @BeforeInsert()
    async validate() {
        await validateOrReject(this, {skipUndefinedProperties: true});
    }


    









}
