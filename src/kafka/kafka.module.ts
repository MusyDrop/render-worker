import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ExtendedConfigService } from '../config/extended-config.service';
import { ConfigModule } from '../config/config.module';
import { PinoLogger } from 'nestjs-pino';

@Module({
  imports: [ConfigModule],
  providers: [
    KafkaService,
    {
      inject: [ExtendedConfigService, PinoLogger],
      provide: KafkaService,
      useFactory: (
        config: ExtendedConfigService,
        logger: PinoLogger
      ): KafkaService =>
        new KafkaService(
          {
            clientId: config.get('kafka.clientId'),
            brokers: config.get('kafka.brokers')
          },
          logger
        )
    }
  ],
  exports: [KafkaService]
})
export class KafkaModule {}
