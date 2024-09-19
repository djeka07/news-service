import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ArticleRequest } from 'src/news/news.request';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class NewsSource {
  @Prop()
  id: string;
  @Prop()
  name: string;
}

@Schema()
export class Article {
  constructor(url: string, articleRequest: ArticleRequest) {
    this.source = articleRequest.source;
    this.author = articleRequest.author;
    this.title = articleRequest.title;
    this.description = articleRequest.description;
    this.url = url;
    this.urlToImage = articleRequest.urlToImage;
    this.publishedAt = articleRequest.published;
  }

  @Prop()
  source: NewsSource;
  @Prop()
  author: string;
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop({ unique: true, required: true })
  url: string;
  @Prop({ required: false })
  urlToImage?: string;
  @Prop()
  publishedAt: string;
}

type SortBy = 'relevancy' | 'popularity' | 'publishedAt';

@Schema()
export class SearchItem {
  @Prop({ unique: true, required: true })
  name: string;
  @Prop({ required: true })
  query: string;
  @Prop()
  sortBy: SortBy;
}

@Schema()
export class User {
  constructor(email: string) {
    this.email = email;
  }
  @Prop()
  id: string;

  @Prop({ required: true })
  apiKey: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  readList: Article[];

  @Prop()
  searches: SearchItem[];

  @Prop({ required: true })
  language: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
