import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateUserRequest {
  @ApiProperty({ required: true })
  apiKey: string;

  @ApiProperty({ required: true })
  language: string;
}
