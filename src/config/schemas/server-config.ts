import Joi from 'joi';
import { NodeEnv } from '../node-env.enum';
import { LogLevel } from '../../logger/log-level.enum';
import { JoiConfig } from '../../utils/joi/joiTypes';
import * as process from 'process';

export interface ServerConfig {
  port: number;
  loggerLevel: LogLevel;
  nodeEnv: NodeEnv;
  adminEmail: string;
  adminPassword: string;
  baseUrl: string;
  fullUrl: string;
  isProduction: boolean;
  globalPrefix: string;
  clientBaseUrl: string;
}

export const serverConfigSchema = (): JoiConfig<ServerConfig> => ({
  port: {
    value: parseInt(process.env.PORT as string, 10),
    schema: Joi.number().required()
  },
  loggerLevel: {
    value: process.env.LOGGER_GLOBAL_LOG_LEVEL as LogLevel,
    schema: Joi.string().equal(...Object.keys(LogLevel)) // equal, valid no longer accept arrays, sad :(
  },
  nodeEnv: {
    value: process.env.NODE_ENV as NodeEnv,
    schema: Joi.string()
      .equal(...Object.keys(NodeEnv))
      .required() // equal, valid no longer accepts arrays, sad :(
  },
  adminEmail: {
    value: process.env.INIT_ADMIN_EMAIL as string,
    schema: Joi.string().required()
  },
  adminPassword: {
    value: process.env.INIT_ADMIN_PASSWORD as string,
    schema: Joi.string().required()
  },
  baseUrl: {
    value: process.env.SERVER_BASE_URL as string,
    schema: Joi.string().required()
  },
  isProduction: {
    value: (process.env.NODE_ENV as NodeEnv) === NodeEnv.production,
    schema: Joi.boolean().required()
  },
  globalPrefix: {
    value: process.env.SERVER_GLOBAL_PREFIX as string,
    schema: Joi.string().required()
  },
  fullUrl: {
    value: `${process.env.SERVER_BASE_URL as string}${
      process.env.SERVER_GLOBAL_PREFIX as string
    }`,
    schema: Joi.string().required()
  },
  clientBaseUrl: {
    value: process.env.CLIENT_BASE_URL as string,
    schema: Joi.string().required()
  }
});
