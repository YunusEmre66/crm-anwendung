import { AfterInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { District } from "./District";
import { Town } from "./Town";
import { Country } from "./Country"; // Country sınıfını doğru dosyadan import edin
import { User } from "./User"; // User sınıfını doğru dosyadan import edin
import { Log } from "./Log"; // Log sınıfını doğru dosyadan import edin
import { ContactEnum } from "./ContactEnum"; // ContactEnum sınıfını doğru dosyadan import edin
import { AppDataSource } from "../data-source";

@Entity("addresses")
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: ContactEnum, default: ContactEnum.HOME, nullable: false })
    addressType: ContactEnum;

    @Column({ nullable: true, length: 250 })
    addressLine: string;

    @Column({ nullable: true, length: 30 })
    location: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Country, (country) => country.id)
    @JoinColumn({ name: "countryId" })
    country: Country;

    @ManyToOne(() => District, (district) => district.id)
    @JoinColumn({ name: "districtId" })
    district: District;

    @ManyToOne(() => Town, (town) => town.id)
    @JoinColumn({ name: "townId" })
    town: Town;

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
            type: "address",
            process: "address information",
            user: this.user
        });
        await logRepository.save(log);
    }
}