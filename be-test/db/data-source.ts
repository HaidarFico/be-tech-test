import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config'

export const dataSourceOptions: DataSourceOptions = {
    name: 'default',
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;