import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { JobsCrdMapper } from './mappers/jobs-crd.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { TemplatesModule } from '../templates/templates.module';
import { AuthModule } from '../auth/auth.module';
import { JobsSystemController } from './jobs-system.controller';
import { JobsSystemCrdMapper } from './mappers/JobsSystemCrdMapper';

@Module({
  imports: [
    KafkaModule,
    TypeOrmModule.forFeature([Job]),
    TemplatesModule,
    AuthModule
  ],
  controllers: [JobsController, JobsSystemController],
  providers: [JobsService, JobsCrdMapper, JobsSystemCrdMapper]
})
export class JobsModule {}
