import { Module } from '@nestjs/common';
import { URLController } from './controller/url.controller';
import { UrlService } from './services/url.service';
import { DatabaseModule } from '../database/database.module';
import { Link } from '../../common/link.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([Link])],
    controllers: [URLController],
    providers: [{
        provide: 'UrlService',
        useClass: UrlService
    }]
})
export class UrlModule {}
