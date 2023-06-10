import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
