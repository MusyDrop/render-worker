import { JoiConfig } from '../../utils/joi/joiTypes';
import Joi from 'joi';

export interface MicroservicesConfig {
  mainService: {
    baseUrl: string;
  };
}

export const microservicesConfigSchema =
  (): JoiConfig<MicroservicesConfig> => ({
    mainService: {
      baseUrl: {
        value: process.env.MAIN_SERVICE_BASE_URL as string,
        schema: Joi.string().required()
      }
    }
  });
