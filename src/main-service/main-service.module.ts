import { Module } from '@nestjs/common';
import { MainServiceApiClient } from './main-service.api-client';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../config/config.module';
import { ExtendedConfigService } from '../config/extended-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ExtendedConfigService],
      useFactory: (config: ExtendedConfigService) => ({
        baseURL: `${config.get('microservices.mainService.baseUrl')}/api/main`
      })
    })
  ],
  providers: [MainServiceApiClient],
  exports: [MainServiceApiClient]
})
export class MainServiceModule {}
