import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
dotenv.config();
import { dbRunMongoose } from './general/db';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await dbRunMongoose();
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
