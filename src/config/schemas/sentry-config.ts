import { JoiConfig } from '../../utils/joi/joiTypes';
import Joi from 'joi';

export interface SentryConfig {
  dsn: string;
  debug: boolean;
}

export const sentryConfigSchema = (): JoiConfig<SentryConfig> => ({
  dsn: {
    value: process.env.SENTRY_DSN as string,
    schema: Joi.string().required()
  },
  debug: {
    value: (process.env.SENTRY_DEBUG as string) === 'true',
    schema: Joi.boolean().required()
  }
});
