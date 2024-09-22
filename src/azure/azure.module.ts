import { HttpModule } from '@nestjs/axios';
import { AzureService } from './azure.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AzureService],
  exports: [AzureService],
})
export class AzureModule {}
