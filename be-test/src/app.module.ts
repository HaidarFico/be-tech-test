import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './common/link.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { UrlModule } from './modules/url/url.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        }
      ]
    }),
    TypeOrmModule.forFeature([Link]),
    UrlModule,
  ],
})
export class AppModule {}
