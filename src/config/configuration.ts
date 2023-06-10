import { JoiUtil } from '../utils/joi/JoiUtil';
import { ServerConfig, serverConfigSchema } from './schemas/server-config';
import { RedisConfig, redisConfigSchema } from './schemas/redis-config';
import { MinioConfig, minioConfigSchema } from './schemas/minio-config';
import { JoiAppConfig } from '../utils/joi/joiTypes';
import { SentryConfig, sentryConfigSchema } from './schemas/sentry-config';
import { KafkaConfig, kafkaConfigSchema } from './schemas/kafka-config';
import {
  MicroservicesConfig,
  microservicesConfigSchema
} from './schemas/microservices-config';

// the keys from here in the custom config service
export interface AppConfig {
  server: ServerConfig;
  redis: RedisConfig;
  minio: MinioConfig;
  sentry: SentryConfig;
  kafka: KafkaConfig;
  microservices: MicroservicesConfig;
}

export const appSchema = (): JoiAppConfig<AppConfig> => ({
  server: serverConfigSchema(),
  redis: redisConfigSchema(),
  minio: minioConfigSchema(),
  sentry: sentryConfigSchema(),
  kafka: kafkaConfigSchema(),
  microservices: microservicesConfigSchema()
});

export const configuration = (): AppConfig => {
  const schema = appSchema();
  // validate each schema and extract actual values
  return Object.keys(schema).reduce(
    (config, key) => ({
      ...config,
      [key]: JoiUtil.validate(schema[key as keyof AppConfig])
    }),
    {} as AppConfig
  );
};
