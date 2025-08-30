import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';

  // Middleware
  app.use(cookieParser());
  app.use(express.json());

  // CORS configurado correctamente para cookies cross-site
  app.enableCors({
    origin: process.env.FRONTEND_URL, // tu frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
  });

  // Render asigna el puerto vía variable de entorno
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
