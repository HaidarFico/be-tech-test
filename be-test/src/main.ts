import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new ConsoleLogger() });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
