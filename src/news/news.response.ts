import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/user/user.schema';

const isRemoved = '[Removed]';

export class NewsApiSourceResponse {
  id: string;
  name: string;
}

export class NewsApiArticleResponse {
  source: NewsApiSourceResponse;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
}

export class NewsApiDataResponse {
  status: 'ok' | 'error';
  totalResults: number;
  articles: NewsApiArticleResponse[];
}

export class NewsSourceResponse {
  constructor(source: NewsApiSourceResponse) {
    this.id = source.id;
    this.name = source.name;
  }
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}
export class NewsArticleResponse {
  constructor(
    article: NewsApiArticleResponse | Article,
    isInReadingList: boolean,
  ) {
    this.source = new NewsSourceResponse(article.source);
    this.author = article.author;
    this.title = article.title?.replaceAll(`- ${article.author}`, '');
    this.description = article.description;
    this.url = article.url;
    this.urlToImage = article.urlToImage;
    this.published = article.publishedAt;
    this.isInReadingList = isInReadingList;
    this.isAvailable =
      article.title?.toLowerCase() !== isRemoved?.toLowerCase();
  }

  @ApiProperty({ type: NewsSourceResponse })
  source: NewsSourceResponse;
  @ApiProperty()
  author: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description?: string | null;
  @ApiProperty()
  url: string;
  @ApiProperty({ required: false })
  urlToImage?: string | null;
  @ApiProperty()
  published: string;
  @ApiProperty()
  isInReadingList: boolean;
  @ApiProperty()
  isAvailable: boolean;
}

export class NewsResponse {
  constructor(
    articleResponse: NewsApiDataResponse,
    readingList: Article[] = [],
  ) {
    this.total = articleResponse.totalResults;
    this.items = articleResponse.articles?.map(
      (article) =>
        new NewsArticleResponse(
          article,
          readingList?.some((a) => a.url === article.url),
        ),
    );
  }
  @ApiProperty()
  total: number;
  @ApiProperty({ type: [NewsArticleResponse] })
  items: NewsArticleResponse[];
}
