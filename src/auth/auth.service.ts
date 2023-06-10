import { Injectable } from '@nestjs/common';
import { MainServiceApiClient } from '../main-service/main-service.api-client';
import { FindUserInfoByAccessTokenResponseDto } from '../main-service/dtos/response/find-user-info-by-access-token-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly mainServiceApiClient: MainServiceApiClient) {}

  public async findUserInfoByAccessToken(
    accessToken: string
  ): Promise<FindUserInfoByAccessTokenResponseDto> {
    return this.mainServiceApiClient.findUserInfoByAccessToken(accessToken);
  }
}
