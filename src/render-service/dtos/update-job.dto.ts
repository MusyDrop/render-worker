import { AnyObject } from '../../utils/utility-types';
import { JobStatus } from '../job-status.enum';

export class UpdateJobDto {
  status: JobStatus;
  settings: AnyObject;
}
