import { JobStatus } from '../../enums/job-status.enum';
import { AnyObject } from '../../../utils/utility-types';

export class CreateJobResponseDto {
  guid: string;
  status: JobStatus;
  templateGuid: string;
  audioFileName: string;
  settings: AnyObject;
  createdAt: Date;
}
