import { Module } from '@nestjs/common';
import { ConfigModule as RootConfigModule } from '@nestjs/config';
import { configuration } from './configuration';
import { ExtendedConfigService } from './extended-config.service';

@Module({
  imports: [
    RootConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      // envs can be edited with a help of this function as well
      // explicitly defined just to not forget about this feature
      validate: (config) => {
        return config;
      }
    })
  ],
  providers: [ExtendedConfigService],
  exports: [ExtendedConfigService, ConfigModule]
})
export class ConfigModule {}
