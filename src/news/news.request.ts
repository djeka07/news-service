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
    query: string = '',
  ) {
    super(apiKey, page, take, query);
    this.sortBy = sortBy;
    this.language = language;
  }
  sortBy: string;
  language: string;
}

export class GetTopNewsRequest extends GetNewsBaseRequest {
  constructor(
    apiKey: string,
    country: string,
    page: number,
    take: number,
    query: string = '',
    category: string = '',
  ) {
    super(apiKey, page, take, query);
    this.country = country;
    this.category = category;
  }
  country: string;
  category?: string;
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
