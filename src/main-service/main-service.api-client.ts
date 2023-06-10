import { Injectable, OnModuleInit } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { HttpService } from '@nestjs/axios';
import { FindUserInfoByAccessTokenResponseDto } from './dtos/response/find-user-info-by-access-token-response.dto';

@Injectable()
export class MainServiceApiClient {
  private readonly axios: AxiosInstance;

  constructor(private readonly httpService: HttpService) {
    this.axios = httpService.axiosRef;
  }

  public async findUserInfoByAccessToken(
    accessToken: string
  ): Promise<FindUserInfoByAccessTokenResponseDto> {
    const res = await this.axios.get<FindUserInfoByAccessTokenResponseDto>(
      '/users/me',
      {
        headers: {
          Cookie: this.composeCookieHeader(accessToken)
        }
      }
    );

    return res.data;
  }

  private composeCookieHeader(accessToken: string): string {
    return `Auth=${accessToken}`;
  }
}
