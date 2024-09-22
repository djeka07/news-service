import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewsService } from 'src/news/news.service';
import { NewsArticleResponse } from '../news/news.response';
import { NewsSearchArticle } from './search.schema';
import { SearchService } from './search.service';

@Injectable()
export class SearchTaskService {
  private indexName: string;
  private newsApiKey: string;
  constructor(
    private readonly loggerService: LokiLoggerService,
    private readonly searchService: SearchService,
    private readonly newsService: NewsService,
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
        const newsResponses = news?.articles?.map(
          (article) => new NewsArticleResponse(article, false),
        );
        const searchDocuments = newsResponses.map(
          (newsResponse) => new NewsSearchArticle(newsResponse),
        );
        await this.searchService.addDocuments(searchDocuments);
      } while (page < 15 || results === 0);
    } catch (error) {
      this.loggerService.error(
        'Error in cron job',
        error?.response?.data?.message,
      );
    }
  }
}
