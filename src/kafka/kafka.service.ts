import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AnyObject } from '../utils/utility-types';

export const KAFKA_CLIENT_TOKEN = 'kafka-client-token';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_CLIENT_TOKEN) private readonly clientKafka: ClientKafka,
    @InjectPinoLogger(KafkaService.name) private readonly logger: PinoLogger
  ) {}

  public async emit<T extends AnyObject>(
    topicName: string,
    data: T
  ): Promise<void> {
    await this.clientKafka.emit(top, data);
  }

  public async onModuleInit(): Promise<void> {
    await this.clientKafka.connect();
    this.logger.info('Connected');
  }
}
