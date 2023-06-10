import {
  BadRequestException,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { startTime } from 'pino-http';

@Injectable()
export class MetadataMiddleware implements NestMiddleware {
  constructor(
    @InjectPinoLogger(MetadataMiddleware.name)
    private readonly logger: PinoLogger
  ) {}

  public async use(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // startTime
    res[startTime] = Date.now(); // used in logger later

    // IP Address
    const rawIp =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    req.forwardedForIp = (rawIp as string).split(',')[0].trim();

    if (!req.forwardedForIp) {
      this.logger.error(
        `Unable to detect req.forwardedForIp. All headers: ${JSON.stringify(
          req.headers
        )}`
      );
      throw new BadRequestException('Unable to detect source IP');
    }

    next();
  }
}
