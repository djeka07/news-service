import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Module } from '@nestjs/common';
import { SearchTaskService } from './search.task.service';
import { NewsModule } from 'src/news/news.module';
import { AzureModule } from 'src/azure/azure.module';
import { SearchFactory } from './search.factory';

@Module({
  imports: [NewsModule, AzureModule],
  controllers: [SearchController],
  providers: [SearchService, SearchTaskService, SearchFactory],
})
export class SearchModule {}
