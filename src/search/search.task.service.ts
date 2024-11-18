import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Image } from 'src/azure/azure.request';
import { AzureService } from '../azure/azure.service';
import { NewsService } from '../news/news.service';
import { SearchFactory } from './search.factory';
import { SearchService } from './search.service';
import { MeiliSearchService } from '@djeka07/nestjs-meilisearch';
import { createHash } from 'node:crypto';

@Injectable()
export class SearchTaskService {
  private indexName: string;
  private newsApiKey: string;
  constructor(
    private readonly loggerService: LokiLoggerService,
    private readonly searchService: SearchService,
    private readonly newsService: NewsService,
    private readonly searchFactory: SearchFactory,
    private readonly azureService: AzureService,
    private readonly meilieSearchService: MeiliSearchService,
    private readonly configService: ConfigService,
  ) {
    this.indexName = configService.getOrThrow<string>('MEILISEARCH_INDEX');
    this.newsApiKey = configService.getOrThrow<string>('NEWS_API_KEY');
  }

  async handleCron() {
    try {
      this.loggerService.info('Handling cron import job');
      let page = 1;
      let results: number;
      do {
        const news = await this.newsService.get({
          apiKey: this.newsApiKey,
          page,
          take: 100,
          language: 'sv',
          query: '*',
          sortBy: 'publishedAt',
        });
        page += 1;
        results = news?.articles?.length || 0;
        const imagesToUpload = news.articles
          .filter((r) => !!(r.urlToImage as string))
          .map(
            (r) =>
              ({
                name: createHash('sha1').update(r.url).digest('hex'),
                url: r.urlToImage,
              }) as Image,
          );
        const uploadedImages =
          await this.azureService.uploadImages(imagesToUpload);
        const searchResults = this.searchFactory.create(
          news.articles,
          uploadedImages,
        );

        await this.searchService.addDocuments(searchResults);
      } while (page < 2 || results === 0);
    } catch (error) {
      this.loggerService.error(
        'Error in cron job',
        error?.response?.data?.message,
      );
    }
  }
  async deleteDocuments() {
    await this.meilieSearchService.deleteAllDocuments(this.indexName);
  }
}
