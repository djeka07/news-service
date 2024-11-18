import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/auth/auth.decorator';
import { AzureService } from 'src/azure/azure.service';
import { SearchService } from './search.service';
import { SearchTaskService } from './search.task.service';

@Controller('/api/v1/search')
export class SearchController {
  private imagePath: string;
  constructor(
    private readonly searchTaskService: SearchTaskService,
    private readonly searchService: SearchService,
    private readonly azureService: AzureService,
    private readonly configService: ConfigService,
  ) {
    this.imagePath = configService.getOrThrow<string>('IMAGE_PATH');
  }

  @Public()
  @Get()
  async get() {
    await this.searchTaskService.deleteDocuments();
    this.searchTaskService.handleCron();
  }
}
