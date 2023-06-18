import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { S3Module } from '../s3/s3.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [KafkaModule, S3Module, ConfigModule],
  controllers: [JobsController]
})
export class JobsModule {}
