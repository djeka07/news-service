import { createHash } from 'node:crypto';
import { NewsApiArticleResponse, NewsApiSourceResponse } from './news.response';

export class NewsSearchArticleSource {
  constructor(source: NewsApiSourceResponse) {
    this.id = source.id;
    this.name = source.name;
  }
  id: string;
  name: string;
}

export class NewsSearchArticle {
  constructor(article: NewsApiArticleResponse) {
    this.id = createHash('sha1').update(article.url).digest('hex');
    this.source = new NewsSearchArticleSource(article.source);
    this.author = article.author;
    this.title = article.title;
    this.description = article.description;
    this.url = article.url;
    this.image = article.urlToImage || undefined;
    this.published = article.publishedAt;
  }

  id: string;
  source: NewsApiSourceResponse;
  author?: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  published: string;
}
