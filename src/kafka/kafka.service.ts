import { Injectable } from '@nestjs/common';
import { Consumer, IHeaders, Kafka, KafkaConfig } from 'kafkajs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export type KafkaSimplifiedHeaders = Record<string, string>;
export type KafkaEachMessageHandler<T> = (
  message: T,
  key?: string | null,
  headers?: IHeaders | null
) => Promise<void>;

@Injectable()
export class KafkaService {
  protected readonly client: Kafka;

  constructor(
    protected readonly options: KafkaConfig,
    @InjectPinoLogger(KafkaService.name) private readonly logger: PinoLogger
  ) {
    this.client = new Kafka({
      clientId: options.clientId,
      brokers: options.brokers
    });
  }

  public async on<T>(
    topicName: string,
    groupId: string,
    handler: KafkaEachMessageHandler<T>
  ): Promise<Consumer> {
    const consumer = this.client?.consumer({
      groupId: groupId
    });

    await consumer.connect();
    await consumer.subscribe({
      topics: [topicName]
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const payload = JSON.parse(message.value.toString());
        const key = message.key?.toString();

        const simplifiedHeaders = message.headers as KafkaSimplifiedHeaders;
        const parsedHeaders: Record<string, string> = {};
        for (const headerKey in simplifiedHeaders) {
          parsedHeaders[headerKey] = simplifiedHeaders[headerKey].toString();
        }

        await handler(payload, key, parsedHeaders);
      }
    });

    this.logger.info('Initialised successfully');

    return consumer;
  }
}
