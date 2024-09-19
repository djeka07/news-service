import {
  Controller,
  Get,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { UserService } from 'src/user/user.service';
import { UserEmail } from 'src/auth/auth.decorator';
import { GetNewsRequest, GetTopNewsRequest } from './news.request';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NewsResponse } from './news.response';

@ApiTags('News')
@Controller('/api/v1/news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly userService: UserService,
  ) {}

  @ApiQuery({
    name: 'q',
    type: String,
    example: 'apple',
    allowEmptyValue: true,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    example: 1,
    allowEmptyValue: true,
    required: false,
  })
  @ApiQuery({
    name: 'take',
    type: Number,
    example: 10,
    allowEmptyValue: true,
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    example: 'popularity',
    required: true,
  })
  @ApiQuery({
    name: 'language',
    type: String,
    example: 'en',
    required: true,
  })
  @ApiOkResponse({ type: NewsResponse })
  @Get()
  async get(
    @UserEmail() email: string,
    @Query('q') query: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('language') language: string,
    @Query('sortBy') sortBy: string,
  ) {
    const user = await this.userService.get(email);
    if (!user) {
      throw new NotFoundException(`Could not find user with email ${email}`);
    }
    const responseData = this.newsService.get(
      new GetNewsRequest(
        user.apiKey,
        page,
        take,
        sortBy,
        language,
        query || '*',
      ),
    );
    const readingListData = this.userService.getReadingList(email);
    const [newsResponse, readingListResponse] = await Promise.all([
      responseData,
      readingListData,
    ]);

    return new NewsResponse(newsResponse, readingListResponse);
  }

  @Get('/tops')
  @ApiQuery({
    name: 'q',
    type: String,
    example: 'apple',
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'category',
    type: String,
    example: 'health',
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'country',
    type: String,
    example: 'us',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    example: 1,
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'take',
    type: Number,
    example: 10,
    required: false,
    allowEmptyValue: true,
  })
  @ApiOkResponse({ type: NewsResponse })
  async getTopHeadlines(
    @UserEmail() email: string,
    @Query('q') query: string | undefined,
    @Query('category') category: string | undefined,
    @Query('country') country: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('take', ParseIntPipe) take: number = 10,
  ): Promise<NewsResponse> {
    const user = await this.userService.get(email);
    if (!user) {
      throw new NotFoundException(`Could not find user with email ${email}`);
    }
    const responseData = this.newsService.getTopHeadlines(
      new GetTopNewsRequest(user.apiKey, country, page, take, query, category),
    );

    const readingListData = this.userService.getReadingList(email);
    const [newsResponse, readingListResponse] = await Promise.all([
      responseData,
      readingListData,
    ]);
    return new NewsResponse(newsResponse, readingListResponse);
  }
}
