import { Controller, Get } from '@nestjs/common';
import { SearchTaskService } from './search.task.service';
import { Public } from 'src/auth/auth.decorator';
import { AzureService } from 'src/azure/azure.service';
import { SearchService } from './search.service';

@Controller('/api/v1/search')
export class SearchController {
  constructor(
    private readonly searchTaskService: SearchTaskService,
    private readonly searchService: SearchService,
    private readonly azureService: AzureService,
  ) {}

  @Public()
  @Get()
  async get() {
    const result = await this.searchService.get();
    const images = result.results
      .filter((r) => !!r.image)
      .map((r) => ({ name: r.id, url: r.image }));
    console.log(images);
    await this.azureService.uploadImages(images);
    return result;
  }
}
