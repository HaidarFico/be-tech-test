import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '../../common/link.entity';
import 'dotenv/config'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            name: 'default',
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [Link],
            synchronize: false,
            autoLoadEntities: true,
        }),
    ],
    exports: [TypeOrmModule]
})
export class DatabaseModule { }
