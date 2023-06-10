import { Injectable } from '@nestjs/common';
import { GetHealthDto } from './get-health.dto';

@Injectable()
export class AppService {
  getHealth(): GetHealthDto {
    return {
      ok: 'ok'
    };
  }
}
