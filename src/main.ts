import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json()); // 👈 Asegura que el body sea leído correctamente
  app.use(cookieParser());

  app.enableCors({
    /* origin: 'http://localhost:5173', */
    origin: 'https://tiendazo.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],

  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();