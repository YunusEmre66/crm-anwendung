import { Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("addresses")

export class Address {
    @PrimaryGeneratedColumn()
    id : number; 

    @Column()
    addressType:ContactEnum 
}