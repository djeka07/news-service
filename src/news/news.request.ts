import { IsNotEmpty } from 'class-validator';

class GetNewsBaseRequest {
  constructor(apiKey: string, page: number, take: number, query: string = '') {
    this.apiKey = apiKey;
    this.query = query;

    this.page = page;
    this.take = take;
  }
  query?: string;
  apiKey: string;
  page: number;
  take: number;
}

export class GetNewsRequest extends GetNewsBaseRequest {
  constructor(
    apiKey: string,
    page: number,
    take: number,
    sortBy: string,
    language: string,
    dateFrom?: string,
    dateTo?: string,
    query: string = '*',
  ) {
    super(apiKey, page, take, query);
    this.sortBy = sortBy;
    this.language = language;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
  }
  sortBy: string;
  language: string;
  dateFrom?: string;
  dateTo?: string;
}

export class GetTopNewsRequest extends GetNewsBaseRequest {
  constructor(
    apiKey: string,
    page: number,
    take: number,
    language?: string,
    country?: string,
    query: string = '',
    category: string = '',
  ) {
    super(apiKey, page, take, query);
    this.country = country;
    this.category = category;
    this.language = language;
  }
  country?: string;
  category?: string;
  language?: string;
}

export class NewsSourceRequest {
  id: string;
  name: string;
}
export class ArticleRequest {
  source: NewsSourceRequest;
  author: string;
  @IsNotEmpty()
  title: string;
  description: string;
  urlToImage?: string;
  @IsNotEmpty()
  published: string;
}
