import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Batch} from "./Batch";

@Entity({name: "Filtering"})
export class Filtering {

    @PrimaryColumn()
    date!:Date;

    @Column()
    batch_id!:number

    @ManyToOne(() => Batch, batch => batch.filtering)
    @JoinColumn({name: "batch_id"})
    batch!:Batch;

    @Column()
    vol!:string;

    @Column()
    filterMedium!:string;

    @Column({length: 4})
    new_tank!:string;

    @Column({length: 100})
    notes!:string;
}