import { Entity, Column, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { City } from "./City"; // City sınıfını doğru dosyadan import edin
import { Town } from "./Town"; // Town sınıfını doğru dosyadan import edin

@Entity()
export class District {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => City, (city) => city.id)
    @JoinColumn()
    city: City[];

    @OneToMany(() => Town, (town) => town.district)
    towns: Town[];
}