import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetNewsRequest, GetTopNewsRequest } from './news.request';
import { firstValueFrom } from 'rxjs';
import { NewsApiDataResponse } from './news.response';

@Injectable()
export class NewsService {
  private newsApi: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.newsApi = configService.get<string>('NEWS_API') as string;
  }

  async get({ apiKey, query, page, take, sortBy, language }: GetNewsRequest) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.newsApi}/everything?q=${query}&page=${page}&pageSize=${take}&sortBy=${sortBy}&language=${language}`,
        { headers: { 'X-Api-Key': apiKey } },
      ),
    );
    return response.data;
  }

  async getTopHeadlines({
    apiKey,
    category,
    query,
    country,
    page,
    take,
  }: GetTopNewsRequest): Promise<NewsApiDataResponse> {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.newsApi}/top-headlines?q=${query}&category=${category}&country=${country}&page=${page}&pageSize=${take}`,
        { headers: { 'X-Api-Key': apiKey } },
      ),
    );
    return response.data;
  }
}
