import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get configuration
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3001);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api/v1');
  const allowedOrigins = configService.get<string[]>('app.allowedOrigins', [
    'http://localhost:3000',
  ]);

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip props that don't have decorators
      forbidNonWhitelisted: true, // Throw error if extra props
      transform: true, // Auto transform to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  setupSwagger(app, port);

  await app.listen(port);

  console.log(
    `🚀 Context.ai API running on: http://localhost:${port}/${apiPrefix}`,
  );
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📖 API Docs (Swagger): http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error('❌ Error during application bootstrap:', error);
  process.exit(1);
});
