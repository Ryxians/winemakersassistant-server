import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Batch} from "./Batch";
import {Blended_Batch} from "./Blended_Batch";

@Entity({name: "Wine"})
export class Wine {
    @PrimaryGeneratedColumn()
    wine_id!: number;

    @Column({
        length: 50
    })
    fancy_name!: string;

    @Column({
        length:50
    })
    wine_style!: string;

    @Column()
    kit_volume!: number;

    @OneToMany(() => Batch, batch => batch.wine)
    batchs!: Batch[]

    @OneToMany(() => Blended_Batch, bbatch => bbatch.wine)
    blends!: Blended_Batch[]
}