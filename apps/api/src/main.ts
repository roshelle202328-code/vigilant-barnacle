import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // API versioning — /api/v1/...
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipe (class-validator + class-transformer)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('FactuFlow API')
    .setDescription('Multi-country electronic invoicing SaaS for Latin American SMEs')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3001')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.API_PORT ?? 3001;
  const host = process.env.API_HOST ?? '0.0.0.0';

  await app.listen(port, host);
  console.log(`🚀 FactuFlow API running on http://${host}:${port}`);
  console.log(`📚 Swagger docs at http://${host}:${port}/api/docs`);
}

bootstrap();
