import { JoiConfig } from '../../utils/joi/joiTypes';
import Joi from 'joi';

export interface KafkaConfig {
  brokers: string[];
}

export const kafkaConfigSchema = (): JoiConfig<KafkaConfig> => ({
  brokers: {
    value: (process.env.KAFKA_BROKERS as string).split(','),
    schema: Joi.array().items(Joi.string())
  }
});
