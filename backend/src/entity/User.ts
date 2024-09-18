import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsDefined, Length } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    @IsDefined({ message: "Vorname ist erforderlich." })
    @Length(3, 100)
    firstName!: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    lastName!: string; 

    @Column({ type: 'varchar', length: 15, nullable: true })
    phone?: string; // Changed phone type to string for better handling of numbers and added optional
}
