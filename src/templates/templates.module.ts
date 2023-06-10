import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { ConfigModule } from '../config/config.module';
import { S3Module } from '../s3/s3.module';
import { TemplatesCrdMapper } from './mappers/templates-crd.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    S3Module,
    TypeOrmModule.forFeature([Template]),
    AuthModule
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplatesCrdMapper],
  exports: [TemplatesService]
})
export class TemplatesModule {}
