import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.schema';
import { NewsArticleResponse } from 'src/news/news.response';

export class UserResponse {
  constructor(user: User) {
    this.apiKey = user.apiKey;
    this.email = user.email;
    this.language = user.language;
    this.readingList = user.readList?.map(
      (r) => new NewsArticleResponse(r, true),
    );
  }

  @ApiProperty()
  apiKey?: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  language?: string;
  @ApiProperty({ type: [] })
  readingList: NewsArticleResponse[];
}
