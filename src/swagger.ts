import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configures Swagger/OpenAPI documentation for the application
 * @param app - NestJS application instance
 * @param port - Port number where the application is running
 */
export function setupSwagger(app: INestApplication, port: number): void {
  const config = new DocumentBuilder()
    .setTitle('Context.ai API')
    .setDescription(
      'API REST para sistema RAG (Retrieval Augmented Generation) con gestión de conocimiento y chat inteligente',
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticación y gestión de usuarios')
    .addTag('knowledge', 'Gestión de fuentes de conocimiento y documentos')
    .addTag('interaction', 'Chat y consultas RAG')
    .addTag('authorization', 'Gestión de roles y permisos')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT de Auth0',
      },
      'JWT-auth',
    )
    .addServer(`http://localhost:${port}`, 'Desarrollo Local')
    .addServer('https://api.context-ai.com', 'Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Context.ai API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
    },
  });
}
