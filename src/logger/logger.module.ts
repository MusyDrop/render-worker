import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule as RootLoggerModule } from 'nestjs-pino';
import { ConfigModule } from '../config/config.module';
import { ExtendedConfigService } from '../config/extended-config.service';
import { getLoggerParams } from './get-logger-params';
import { NodeEnv } from '../config/node-env.enum';

// TODO: Move to generic lib
@Module({})
export class LoggerModule {
  // I have no idea why it works, but we use Dynamic Module here
  // to overcome unresolved dependency issue in global providers such as interceptor/guard etc.
  public static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        RootLoggerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ExtendedConfigService],
          useFactory: async (config: ExtendedConfigService) => {
            return getLoggerParams(
              config.get('server.loggerLevel'),
              NodeEnv.development // TODO: Make json logging for production
            );
          }
        })
      ]
    };
  }
}
