import { JobStatus } from '../enums/job-status.enum';
import { AnyObject } from '../../utils/utility-types';
import { IsEnum, IsObject } from 'class-validator';

export class UpdateJobDto {
  @IsEnum(JobStatus)
  status: JobStatus;

  @IsObject()
  settings: AnyObject;
}
