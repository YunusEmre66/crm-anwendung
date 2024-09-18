import { Entity, Column, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Town {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => District, (district) => district.id)
    @JoinColumn()
    district: District;

    @OneToMany(() => Address, (address) => address.town)
    address: Address[];
}