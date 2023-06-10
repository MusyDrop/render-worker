export class SuccessResponseDto {
  public message = 'Operation was successful';

  constructor(public readonly operation: string) {}
}
