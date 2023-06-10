import Joi from 'joi';
import { JoiConfig } from '../../utils/joi/joiTypes';

export interface RedisConfig {
  host: string;
  port: number;
}

export const redisConfigSchema = (): JoiConfig<RedisConfig> => ({
  host: {
    value: process.env.REDIS_HOST as string,
    schema: Joi.string().required()
  },
  port: {
    value: parseInt(process.env.REDIS_PORT as string, 10),
    schema: Joi.number().required()
  }
});
