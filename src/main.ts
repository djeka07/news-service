import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';

import { HttpExceptionFilter } from './app/filters/http-exception-filter';
import { MainModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    bufferLogs: true,
    cors: true,
  });

  const config: ConfigService = app.get(ConfigService);
  const loggerService = app.get(LokiLoggerService);
  app.useLogger(loggerService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(compression());

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('News service')
    .setDescription('A API for handling chat and messages')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.startAllMicroservices();
  const port = config.get('PORT') || 3000;
  await app.listen(port, '0.0.0.0');
  loggerService.log(`Application is listening to port ${port}`);
}
bootstrap();
