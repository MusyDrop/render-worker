import { JoiConfig } from '../../utils/joi/joiTypes';
import Joi from 'joi';
import { generateUniqueId } from '../../utils/unique-id-generator';

export interface KafkaConfig {
  brokers: string[];
  clientId: string;
}

export const kafkaConfigSchema = (): JoiConfig<KafkaConfig> => ({
  brokers: {
    value: (process.env.KAFKA_BROKERS as string).split(','),
    schema: Joi.array().items(Joi.string())
  },
  clientId: {
    value: `render-worker-${generateUniqueId()}`
  }
});
