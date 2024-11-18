import { ShareServiceClient } from '@azure/storage-file-share';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Image } from './azure.request';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';

@Injectable()
export class AzureService {
  private client: ShareServiceClient;
  private shareName: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LokiLoggerService,
    private readonly httpService: HttpService,
  ) {
    const connectionString = configService.getOrThrow<string>(
      'AZURE_FILE_SHARE_CONNECTION_STRING',
    );
    this.shareName = configService.getOrThrow<string>('AZURE_FILE_SHARE_NAME');
    this.client = ShareServiceClient.fromConnectionString(connectionString);
  }

  async uploadImages(images: Image[]): Promise<Image[]> {
    this.loggerService.info(`Starting to upload ${images.length}`);
    const directoryClient = this.client
      .getShareClient(this.shareName)
      .getDirectoryClient('');

    const imgs = await Promise.all(
      images.map(async (image) => {
        const imageExtension = image.url?.split('?')?.[0]?.split('.').pop();
        const imageName = `${image.name}.${imageExtension}`;
        try {
          this.loggerService.info(`Starting to download ${imageName}`);
          const { data, headers } = await firstValueFrom(
            this.httpService.get(image.url, {
              responseType: 'stream',
            }),
          );
          const totalLength = parseInt(headers['content-length']);
          const file = await directoryClient.createFile(imageName, totalLength);
          this.loggerService.info(`Starting to upload ${imageName}`);
          await file.fileClient.uploadStream(
            data,
            totalLength,
            totalLength,
            totalLength,
          );
          return { name: image.name, url: imageName };
        } catch (error) {
          this.loggerService.error(
            `Failed uploading image ${imageName} ${error?.message}`,
          );
          return null;
        }
      }),
    );
    return imgs.filter((img): img is Image => !!img);
  }
}
