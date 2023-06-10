import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class RenderServiceApiClient {
  private readonly axios: AxiosInstance;

  constructor(private readonly httpService: HttpService) {
    this.axios = httpService.axiosRef;
  }

  public async updateJob(guid: string): Promise<void> {
    await this.axios.get<void>(`/system/jobs/${guid}`);
  }

  async onModuleInit(): Promise<void> {
    await this.updateJob('asdasd');
  }
}
