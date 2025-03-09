import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Link {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    longUrl: string;

    @Column()
    shortUrl: string;

    @Column()
    urlCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    expiredAt: Date;
}