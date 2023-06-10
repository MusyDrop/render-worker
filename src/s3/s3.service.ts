import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ExtendedConfigService } from '../config/extended-config.service';
import { Client } from 'minio';
import { generateUniqueId } from '../utils/unique-id-generator';
import { Readable } from 'node:stream';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly client: Client;

  constructor(private readonly config: ExtendedConfigService) {
    this.client = new Client({
      endPoint: config.get('minio.host'),
      port: config.get('minio.port'),
      accessKey: config.get('minio.accessKey'),
      secretKey: config.get('minio.secretKey'),
      useSSL: false
    });
  }

  /**
   * Puts object into specified bucket
   * @returns object name
   * @param bucketName
   * @param object
   * @param objectName
   */
  public async putObject(
    bucketName: string,
    object: Buffer | Readable | string,
    objectName: string = generateUniqueId()
  ): Promise<string> {
    await this.client.putObject(bucketName, objectName, object);
    return objectName;
  }

  public async getObject(
    bucketName: string,
    objectName: string
  ): Promise<Readable> {
    try {
      return await this.client.getObject(bucketName, objectName);
    } catch (e) {
      if (e.code === 'NoSuchKey') {
        throw new NotFoundException(
          'Unable to find object by the specified name'
        );
      }

      throw e;
    }
  }

  /**
   * Init all buckets
   */
  public async onModuleInit(): Promise<void> {
    const bucketNames = Object.values(this.config.get('minio.buckets'));

    for (const bucket of bucketNames) {
      const exists = await this.client.bucketExists(bucket);

      if (!exists) {
        await this.client.makeBucket(bucket);
      }
    }
  }
}
