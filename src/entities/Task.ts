import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm"
import SnowflakeColumn from "./decorators/SnowflakeColumn"

export const VALID_STATUSES = ["in-progress", "abandoned", "done", "reported", "hidden"]
export type TaskStatus = "in-progress" | "abandoned" | "done" | "reported" | "hidden"

@Entity({ name: "tasks" })
export default class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ length: 2048 })
    description: string

    @SnowflakeColumn()
    creator: string

    @Column("simple-array")
    assignees: string[]

    @Column({ nullable: true })
    status?: TaskStatus
}
