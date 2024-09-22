import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetNewsRequest, GetTopNewsRequest } from './news.request';
import { firstValueFrom } from 'rxjs';
import { NewsApiDataResponse } from './news.response';
import { stringify } from 'qs';

@Injectable()
export class NewsService {
  private newsApi: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.newsApi = configService.get<string>('NEWS_API') as string;
  }

  async get({
    apiKey,
    query,
    page,
    take,
    sortBy,
    language,
  }: GetNewsRequest): Promise<NewsApiDataResponse> {
    const queryParams = stringify(
      { q: query, sortBy, page, take, language },
      { skipNulls: true },
    );
    const response = await firstValueFrom(
      this.httpService.get(`${this.newsApi}/everything?${queryParams}`, {
        headers: { 'X-Api-Key': apiKey },
      }),
    );
    return response.data;
  }

  async getTopHeadlines({
    apiKey,
    category,
    query,
    language,
    country,
    page,
    take,
  }: GetTopNewsRequest): Promise<NewsApiDataResponse> {
    const queryParams = stringify(
      { q: query, category, country, page, take, language },
      { skipNulls: true },
    );
    console.log(queryParams);
    const response = await firstValueFrom(
      this.httpService.get(`${this.newsApi}/top-headlines?${queryParams}`, {
        headers: { 'X-Api-Key': apiKey },
      }),
    );
    return response.data;
  }
}
