import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ExtendedConfigService } from './config/extended-config.service';
import cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ExtendedConfigService>(ExtendedConfigService);

  const logger = app.get(Logger);
  const globalPrefix = configService.get('server.globalPrefix');

  app.use(cookieParser());
  app.useLogger(logger);
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      // transforms if @Type() decorator is specified in dtos
      // Automatically transforms with @Params() decorator, i.e. @Params(':id') id -> number
      // To sum up, transformation of primitive types only works with parameters
      transform: true,
      validationError: {
        value: true // exposes validated value
      }
      // exceptionFactory: (errors) => new ValidationException(errors)
    })
  );

  app.enableCors({
    credentials: true,
    origin: configService.get('server.clientBaseUrl')
  });
  app.enableShutdownHooks();

  // startup
  const port = configService.get('server.port');
  const baseUrl = configService.get('server.baseUrl');

  await app.listen(port);

  logger.log(
    `Server is instantiated and listening to incoming requests - ${baseUrl}`
  );
  logger.log(`Service health check - ${baseUrl}${globalPrefix}/health`);
}

bootstrap();
