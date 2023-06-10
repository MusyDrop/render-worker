import { Controller, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { KafkaTopicController } from '../kafka/kafka-topic-controller.interface';
import { RenderJobPayload } from './render-job-payload.interface';
import { Consumer } from 'kafkajs';

@Controller()
export class JobsController
  implements KafkaTopicController<RenderJobPayload>, OnModuleInit
{
  protected consumer: Consumer;
  public readonly topicName = 'AERendererJobs';
  public readonly groupName = 'ae-render-workers';

  constructor(private readonly kafkaService: KafkaService) {}

  public async execute(
    message: RenderJobPayload,
    key: string | null | undefined
  ): Promise<void> {
    this.consumer.pause([{ topic: this.topicName }]);

    console.log(message); // TODO: Implement rendering

    setTimeout(() => {
      this.consumer.resume([{ topic: this.topicName }]);
    }, 5000);
  }

  public async onModuleInit(): Promise<any> {
    this.consumer = await this.kafkaService.on(
      this.topicName,
      this.groupName,
      this.execute.bind(this) // Important! Otherwise, we lose context!
    );
  }
}
