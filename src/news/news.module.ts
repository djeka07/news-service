import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
