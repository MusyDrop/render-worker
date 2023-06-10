import { KafkaEachMessageHandler } from './kafka.service';

export interface KafkaTopicController<T> {
  topicName: string;
  groupName: string;
  execute: KafkaEachMessageHandler<T>;
}
