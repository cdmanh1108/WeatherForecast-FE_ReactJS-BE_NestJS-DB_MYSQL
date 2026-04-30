import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>('app.origin') || 'http://localhost:5173',
    credentials: true, // Cho phép gửi cookie
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(cookieParser());
  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Global exception handler
  app.useGlobalFilters(new AllExceptionsFilter());
  const port = configService.getOrThrow<number>('app.port');
  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
});
