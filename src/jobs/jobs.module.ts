import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { KafkaModule } from '../kafka/kafka.module';

@Module({ imports: [KafkaModule], controllers: [JobsController] })
export class JobsModule {}
