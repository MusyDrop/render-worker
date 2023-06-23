import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { HttpService } from '@nestjs/axios';
import { UpdateJobDto } from './dtos/update-job.dto';

@Injectable()
export class RenderServiceApiClient {
  private readonly axios: AxiosInstance;

  constructor(private readonly httpService: HttpService) {
    this.axios = httpService.axiosRef;
  }

  public async updateJob(guid: string, dto: UpdateJobDto): Promise<void> {
    await this.axios.patch<void>(`/system/jobs/${guid}`, dto);
  }

  async onModuleInit(): Promise<void> {}
}
