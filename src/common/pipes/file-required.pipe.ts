import { FileValidator, Injectable } from '@nestjs/common';

@Injectable()
export class FileRequiredPipe extends FileValidator {
  public buildErrorMessage(): string {
    return 'File attachment is required';
  }

  public isValid(file?: unknown): boolean | Promise<boolean> {
    return !!file;
  }
}
