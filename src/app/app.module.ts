import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
import { S3Module } from '../s3/s3.module';
import { MetadataMiddleware } from '../common/middlewares/metadata.middleware';
import { SentryModule } from '../sentry/sentry.module';
import { KafkaModule } from '../kafka/kafka.module';
import { JobsModule } from '../jobs/jobs.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot(),
    S3Module,
    SentryModule,
    KafkaModule,
    JobsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  // supplying a middleware here allows DI container usage inside a middleware
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MetadataMiddleware).forRoutes('*');
  }
}
