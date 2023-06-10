import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dtos/create-job.dto';
import { CreateJobResponseDto } from './dtos/response/create-job-response.dto';
import { JobsCrdMapper } from './mappers/jobs-crd.mapper';
import { GetAllJobsResponseDto } from './dtos/response/get-all-jobs-response.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { SuccessResponseDto } from '../common/dtos/success-response.dto';
import { RenderJobDto } from './dtos/render-job.dto';
import { RenderJobResponseDto } from './dtos/response/render-job-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly responseMapper: JobsCrdMapper
  ) {}

  @UseGuards(AuthGuard)
  @Post('/')
  public async create(
    @Body() dto: CreateJobDto
  ): Promise<CreateJobResponseDto> {
    const job = await this.jobsService.create({
      template: { guid: dto.templateGuid },
      audioFileName: dto.audioFileName,
      settings: dto.settings
    });
    return this.responseMapper.createMapper(job);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  public async findAll(): Promise<GetAllJobsResponseDto> {
    const jobs = await this.jobsService.findAll({});
    return this.responseMapper.findAllMapper(jobs);
  }

  @UseGuards(AuthGuard)
  @Post('/guid')
  public async render(
    @Param('guid') guid: string,
    @Body() dto: RenderJobDto
  ): Promise<RenderJobResponseDto> {
    const job = await this.jobsService.render(guid, dto.settings);
    return this.responseMapper.renderMapper(job);
  }
}
