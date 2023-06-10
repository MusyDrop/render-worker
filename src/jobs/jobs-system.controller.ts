import { Body, Controller, Param, Patch } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { UpdateJobDto } from './dtos/update-job.dto';
import { SuccessResponseDto } from '../common/dtos/success-response.dto';
import { JobsSystemCrdMapper } from './mappers/JobsSystemCrdMapper';

@Controller('/system/jobs')
export class JobsSystemController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly responseMapper: JobsSystemCrdMapper
  ) {}

  @Patch('/:guid')
  public async update(
    @Param('guid') guid: string,
    @Body() dto: UpdateJobDto
  ): Promise<SuccessResponseDto> {
    await this.jobsService.update({
      guid,
      status: dto.status,
      settings: dto.settings
    });
    return this.responseMapper.updateMapper();
  }
}
