import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateOrUpdateUserRequest } from './user.request';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEmail } from 'src/auth/auth.decorator';
import { UserResponse } from './user.response';
import { NewsArticleResponse } from '../news/news.response';
import { ArticleRequest } from '../news/news.request';

@ApiTags('Users')
@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: UserResponse })
  @Get()
  async getUser(@UserEmail() email: string): Promise<UserResponse> {
    const response = await this.userService.get(email);
    if (!response) {
      throw new NotFoundException(`Could not find user with email ${email}`);
    }
    return new UserResponse(response);
  }

  @ApiBody({ type: CreateOrUpdateUserRequest })
  @ApiBadRequestResponse({})
  @Post()
  async createOrUpdateUser(
    @UserEmail() email: string,
    @Body() body: CreateOrUpdateUserRequest,
  ): Promise<UserResponse> {
    const response = await this.userService.createOrUpdateUser(email, body);
    return new UserResponse(response);
  }

  @ApiOkResponse({ type: [NewsArticleResponse] })
  @Get('/readings')
  async getUserReadList(
    @UserEmail() email: string,
  ): Promise<NewsArticleResponse[]> {
    const response = await this.userService.getReadingList(email);
    return response?.map((r) => new NewsArticleResponse(r, true));
  }

  @Put('/readings/:url')
  @ApiOkResponse({ type: UserResponse })
  async addToUserReadingList(
    @UserEmail() email: string,
    @Param('url') url: string,
    @Body() article: ArticleRequest,
  ): Promise<UserResponse> {
    const hasArticle = await this.userService.hasArticle(email, url);
    if (hasArticle) {
      throw new BadRequestException('Article is already added');
    }

    const response = await this.userService.addToUserReadingsList(
      email,
      url,
      article,
    );

    return new UserResponse(response!);
  }

  @ApiOkResponse({ type: UserResponse })
  @Delete('/readings/:url')
  async removeFromUserReadingList(
    @UserEmail() email: string,
    @Param('url') url: string,
  ): Promise<UserResponse> {
    const hasArticle = await this.userService.hasArticle(email, url);
    if (!hasArticle) {
      throw new BadRequestException('Article does not exists in reading list');
    }

    const response = await this.userService.removeFromUserReadingsList(
      email,
      url,
    );
    return new UserResponse(response!);
  }
}
