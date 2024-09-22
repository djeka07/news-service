import { Injectable } from '@nestjs/common';
import { MeiliSearchService, Task } from '@djeka07/nestjs-meilisearch';
import { NewsSearchArticle } from './search.schema';
import { ConfigService } from '@nestjs/config';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';

@Injectable()
export class SearchService {
  private indexName: string;
  constructor(
    private readonly meiliSearchService: MeiliSearchService,
    private readonly loggerService: LokiLoggerService,
    private readonly configService: ConfigService,
  ) {
    this.indexName = configService.getOrThrow<string>('MEILISEARCH_INDEX');
  }

  async get() {
    const results = await this.meiliSearchService.getDocuments(this.indexName, {
      limit: 500,
    });
    return results;
  }

  async addDocuments(documents: NewsSearchArticle[]) {
    const result = await this.meiliSearchService.addDocuments(
      this.indexName,
      documents,
    );

    let task: Task;

    do {
      task = await this.meiliSearchService.getTask(result.taskUid);
      this.loggerService.info('Processing documents');
    } while (task?.status === 'enqueued' || task?.status === 'processing');

    if (task.status !== 'succeeded') {
      this.loggerService.error(
        `Failed to processing documents, reason: ${task.error?.message}`,
      );
      return null;
    }

    this.loggerService.log('Successfully processing documents', task);
    return null;
  }
}
