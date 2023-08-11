import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {Report} from "../reports/reports.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @Column({default: false})
  isAdmin: boolean

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]
}