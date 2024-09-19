import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeInsert,
    AfterInsert,
    BeforeUpdate,
    AfterUpdate,
    AfterLoad,
  } from "typeorm";
  import { validateOrReject, IsDefined, IsEmail, Length } from "class-validator"; //! validator : veri doğrulama işlemleri için kullanılır.
  import { Phone } from "./Phone";
  import { Email } from "./Email";
  import { Address } from "./Address";
  import * as bcrypt from "bcrypt";
  import { AppDataSource } from "../data-source";
  import { Log } from "./Log";
  import { UserRoleEnum } from "../enum/UserRoleEnum";
  import { UserConfirmedEnum } from "../enum/UserConfirmedEnum";

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
    phone: Phone[];

    @OneToMany(() => Email, (email) => email.user, { cascade: true })
    emails: Email[];

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
        this.password = await bcrypt.hash(this.password, 10);
    }

    @BeforeInsert()
    async validate() {
        await validateOrReject(this, { skipUndefinedProperties: true });
    }

    @AfterInsert()
    async userLog() {
        const logRepository = AppDataSource.getRepository(Log);
        const log = new Log();
        log.type = "user";
        log.process = `Neu Benutzer erstellt: ${this.id} ${this.email} ${this.firstName} ${this.lastName}`;
        log.user = this.id;

        try {
            await logRepository.save(log);
        } catch (error) {
            console.error("Error saving log:", error);
            // Handle the error appropriately (e.g., send notifications, etc.)
        }
    }

    @BeforeUpdate()
    async userBeforeUpdateLog() {
        console.log("********");

        const logRepository = AppDataSource.getRepository(Log);
        const log = new Log();
        log.type = "user";
        log.process = `Vor Aktualisierung des Benutzers: ${this.id} ${this.email} ${this.firstName} ${this.lastName}`;
        log.user = this.id;

        try {
            await logRepository.save(log);
        } catch (error) {
            console.error("Fehler beim Speichern des Logs:", error);
            // Fehler entsprechend behandeln (z.B. Benachrichtigungen senden, etc.)
        }
    }

    @AfterUpdate()
    async userAfterUpdateLog() {
        console.log("-----");

        const logRepository = AppDataSource.getRepository(Log);
        const log = new Log();
        log.type = "user";
        log.process = `Nach Aktualisierung des Benutzers: ${this.id} ${this.email} ${this.firstName} ${this.lastName}`;
        log.user = this.id;

        try {
            await logRepository.save(log);
        } catch (error) {
            console.error("Fehler beim Speichern des Logs:", error);
            // Fehler entsprechend behandeln (z.B. Benachrichtigungen senden, etc.)
        }
    }

    fullName: string;

    @AfterLoad()
    afterLoad() {
        this.fullName = `${this.firstName} ${this.lastName}`;
    }
}