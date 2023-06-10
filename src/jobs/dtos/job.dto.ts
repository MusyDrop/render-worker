import { JobStatus } from '../enums/job-status.enum';
import { AnyObject } from '../../utils/utility-types';

export class JobDto {
  guid: string;
  status: JobStatus;
  templateGuid: string;
  audioFileName: string;
  settings: AnyObject;
  userGuid: string;
  createdAt: Date;
}
