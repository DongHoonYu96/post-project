import "reflect-metadata"
import { DataSource } from "typeorm"
import {Member} from "../domain/member/Member";

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as "mysql" | "postgres" | "sqlite" | "mariadb",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [Member],
    migrations: [],
    subscribers: [],
})