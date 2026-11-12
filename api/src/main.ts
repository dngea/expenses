import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    // read .env
    process.loadEnvFile();
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // app.use() helps to register a middleware from Express, like cookieParser
  app.use(cookieParser());

  // after all configurations, we make the app listen
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
