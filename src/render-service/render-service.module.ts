import { Module } from '@nestjs/common';
import { RenderServiceApiClient } from './render-service.api-client';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../config/config.module';
import { ExtendedConfigService } from '../config/extended-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ExtendedConfigService],
      useFactory: (config: ExtendedConfigService) => ({
        baseURL: `${config.get(
          'microservices.renderService.baseUrl'
        )}/api/render`
      })
    })
  ],
  providers: [RenderServiceApiClient],
  exports: [RenderServiceApiClient]
})
export class RenderServiceModule {}
