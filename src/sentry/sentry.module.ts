import { HttpException, Module } from '@nestjs/common';
import {
  SentryInterceptor,
  SentryModule as RootSentryModule
} from '@ntegral/nestjs-sentry';
import { ConfigModule } from '../config/config.module';
import { ExtendedConfigService } from '../config/extended-config.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    RootSentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ExtendedConfigService],
      useFactory: (config: ExtendedConfigService) => ({
        dsn: config.get('sentry.dsn'),
        debug: config.get('sentry.debug')
      })
    })
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new SentryInterceptor({
        filters: [
          {
            type: HttpException,
            filter: (exception: HttpException): boolean =>
              500 > exception.getStatus() // Only report 500 errors
          }
        ]
      })
    }
  ],
  exports: [RootSentryModule]
})
export class SentryModule {}
