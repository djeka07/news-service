import { createHash } from 'node:crypto';
import {
  NewsApiSourceResponse,
  NewsArticleResponse,
  NewsSourceResponse,
} from 'src/news/news.response';

export class NewsSearchArticleSource {
  constructor(source: NewsSourceResponse) {
    this.id = source.id;
    this.name = source.name;
  }
  id: string;
  name: string;
}

export class NewsSearchArticle {
  constructor(article: NewsArticleResponse) {
    this.id = createHash('sha1').update(article.url).digest('hex');
    this.source = new NewsSearchArticleSource(article.source);
    this.author = article.author;
    this.title = article.title;
    this.description = article.description || undefined;
    this.url = article.url;
    this.image = article.urlToImage || undefined;
    this.published = article.published;
  }

  id: string;
  source: NewsApiSourceResponse;
  author?: string;
  title: string;
  description?: string;
  url: string;
  image?: string;
  published: string;
}
