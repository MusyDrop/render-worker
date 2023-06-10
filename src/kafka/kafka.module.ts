import { Module } from '@nestjs/common';
import { KAFKA_CLIENT_TOKEN, KafkaService } from './kafka.service';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigModule } from '../config/config.module';
import { ExtendedConfigService } from '../config/extended-config.service';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          imports: [ConfigModule],
          inject: [ExtendedConfigService],
          name: KAFKA_CLIENT_TOKEN,
          useFactory: (config: ExtendedConfigService): KafkaOptions => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'render-service',
                brokers: config.get('kafka.brokers')
              },
              producerOnlyMode: true
            }
          })
        }
      ]
    })
  ],
  providers: [KafkaService],
  exports: [ClientsModule, KafkaService]
})
export class KafkaModule {}
