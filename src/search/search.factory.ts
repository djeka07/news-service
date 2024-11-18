import { Injectable } from '@nestjs/common';
import {
  NewsApiArticleResponse,
  NewsArticleResponse,
} from '../news/news.response';
import { NewsSearchArticle } from './search.schema';
import { ConfigService } from '@nestjs/config';
import { Image } from '../azure/azure.request';

@Injectable()
export class SearchFactory {
  private imagePath: string;
  constructor(private readonly configService: ConfigService) {
    this.imagePath = configService.getOrThrow<string>('IMAGE_PATH');
  }
  create(
    documents: NewsApiArticleResponse[],
    uploadedImages: Image[],
  ): NewsSearchArticle[] {
    const newsResponses = documents?.map(
      (article) => new NewsArticleResponse(article, false),
    );
    return newsResponses.map(
      (newsResponse) =>
        new NewsSearchArticle(newsResponse, this.imagePath, uploadedImages),
    );
  }
}
