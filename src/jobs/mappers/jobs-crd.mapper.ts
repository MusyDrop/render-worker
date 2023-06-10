import { Injectable } from '@nestjs/common';
import { ResponseDtoMapper } from '../../common/types';
import { JobsController } from '../jobs.controller';
import { Template } from '../../templates/entities/template.entity';
import { CreateJobResponseDto } from '../dtos/response/create-job-response.dto';
import { JobStatus } from '../enums/job-status.enum';
import { AnyObject } from '../../utils/utility-types';
import { Job } from '../entities/job.entity';
import { GetAllJobsResponseDto } from '../dtos/response/get-all-jobs-response.dto';
import { JobDto } from '../dtos/job.dto';
import { SuccessResponseDto } from 'src/common/dtos/success-response.dto';
import { RenderJobResponseDto } from '../dtos/response/render-job-response.dto';

@Injectable()
export class JobsCrdMapper implements ResponseDtoMapper<JobsController> {
  public createMapper(job: Job): CreateJobResponseDto {
    return {
      guid: job.guid,
      status: job.status,
      templateGuid: job.template.guid,
      audioFileName: job.audioFileName,
      settings: job.settings,
      createdAt: job.createdAt
    };
  }

  public findAllMapper(jobs: Job[]): GetAllJobsResponseDto {
    return {
      jobs: jobs.map((j) => Job.toDto(j)) as JobDto[]
    };
  }

  public renderMapper(job: Job): RenderJobResponseDto {
    return {
      job: Job.toDto(job) as JobDto
    };
  }
}
