import {
  IsDefined,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID
} from 'class-validator';
import { AnyObject } from '../../utils/utility-types';

export class CreateJobDto {
  @IsUUID()
  templateGuid: string;
  // As specified on S3
  @IsString()
  @IsNotEmpty()
  audioFileName: string;

  @IsObject()
  @IsDefined()
  settings: AnyObject;
}
