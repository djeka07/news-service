/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, User } from './user.schema';
import { CreateOrUpdateUserRequest } from './user.request';
import { ArticleRequest } from 'src/news/news.request';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async get(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async getReadingList(email: string): Promise<Article[]> {
    const user = await this.get(email);
    return user?.readList || [];
  }

  async createOrUpdateUser(
    email: string,
    body: CreateOrUpdateUserRequest,
  ): Promise<User> {
    const user = (await this.get(email)) || new User(email);
    user.apiKey = body.apiKey;
    user.language = body.apiKey;
    return this.userModel.create(user);
  }

  async hasArticle(email: string, url: string): Promise<boolean> {
    const user = await this.get(email);
    return user?.readList.some((a) => a.url === url) || false;
  }

  async addToUserReadingsList(
    email: string,
    url: string,
    articleRequest: ArticleRequest,
  ) {
    const user = await this.get(email);
    const article = new Article(url, articleRequest);
    const readList = [...(user?.readList || []), article];
    return this.userModel.findOneAndUpdate({ email }, { readList }).exec();
  }

  async removeFromUserReadingsList(
    email: string,
    url: string,
  ): Promise<User | null> {
    const user = await this.get(email);
    const readList = [...(user?.readList || [])].filter((a) => a.url !== url);
    return this.userModel.findOneAndUpdate({ email }, { readList }).exec();
  }
}
