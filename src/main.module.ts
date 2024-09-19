import {
  LogLevel,
  LokiLoggerModule,
  LokiRequestLoggingInterceptor,
} from '@djeka07/nestjs-loki-logger';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    NewsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>('DB_HOST')}:${configService.get<string>('DB_PORT')}`,
        user: configService.get<string>('DB_USERNAME'),
        pass: configService.get<string>('DB_PASSWORD'),
        dbName: 'users',
      }),
      inject: [ConfigService],
    }),
    LokiLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        app: 'news-service',
        host: configService.get('LOGGING_HOST') as string,
        userId: configService.get('LOGGING_USER_ID') as string,
        password: configService.get('LOGGING_PASSWORD') as string,
        environment: process.env.NODE_ENV as 'development' | 'production',
        logLevel: LogLevel.info,
        logDev: false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LokiRequestLoggingInterceptor },
  ],
})
export class MainModule {}
