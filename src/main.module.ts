import {
  LogLevel,
  LokiLoggerModule,
  LokiRequestLoggingInterceptor,
} from '@djeka07/nestjs-loki-logger';
import { MeiliSearchModule } from '@djeka07/nestjs-meilisearch';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { AzureModule } from './azure/azure.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SearchModule,
    NewsModule,
    AzureModule,
    ScheduleModule.forRoot(),
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
        logDev: true,
      }),
      inject: [ConfigService],
    }),
    MeiliSearchModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('MEILISEARCH_API') as string,
        apiKey: configService.get<string>('MEILISEARCH_API_KEY') as string,
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
