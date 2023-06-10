import { ResponseDtoMapper } from '../../common/types';
import { JobsSystemController } from '../jobs-system.controller';
import { SuccessResponseDto } from '../../common/dtos/success-response.dto';

export class JobsSystemCrdMapper
  implements ResponseDtoMapper<JobsSystemController>
{
  public updateMapper(): SuccessResponseDto {
    return new SuccessResponseDto('Update job');
  }
}
