import { Params } from 'nestjs-pino';
import chalk, { ChalkFunction } from 'chalk';
import { startTime } from 'pino-http';
import { IncomingMessage } from 'http';
import dateFormat from 'dateformat';
import { levels } from 'pino';
import { generateUniqueId } from '../utils/unique-id-generator';
import { LogLevel } from './log-level.enum';
import { NodeEnv } from '../config/node-env.enum';
import { default as pretty } from 'pino-pretty';

// TODO: Move out this logger to a separate lib
const LOG_LEVEL_COLOR_MAP: Record<LogLevel, ChalkFunction> = {
  TRACE: chalk.magenta,
  DEBUG: chalk.greenBright,
  INFO: chalk.green,
  WARN: chalk.yellow,
  ERROR: chalk.red,
  FATAL: chalk.red
};

export const getLoggerParams = (
  level: LogLevel = LogLevel.TRACE,
  nodeEnv: NodeEnv
): Params => ({
  pinoHttp: {
    level: level.toLowerCase(), // pino has levels in lower case while uw-common-cloud expects upper one
    stream:
      nodeEnv === NodeEnv.production
        ? undefined
        : pretty({
            singleLine: true,
            colorize: true,
            messageFormat: (log, messageKey): string => {
              const req = log.req as IncomingMessage;
              const message = log[messageKey] || 'Error occurred';
              const id = req?.id ? `[Request ID: ${req.id}] ` : '';
              const context = log.context ? `[${log.context}] ` : '';
              const path = req ? `[${req?.method}: ${req?.url}] ` : '';
              const formattedTime = `[${dateFormat(
                new Date(log.time as number),
                'yyyy-mm-dd HH:MM:ss'
              )}]`;
              const level = levels.labels[
                log.level as number
              ].toUpperCase() as LogLevel;

              const colorizer = LOG_LEVEL_COLOR_MAP[level];

              const metadata = colorizer(`${formattedTime} [${level}] ${id}`);
              const coloredMessage = colorizer(message);

              return `${metadata}${context}${path}${coloredMessage}`;
            },
            ignore: 'pid,hostname,req,res,responseTime,level,time,context,name'
          }),
    customSuccessMessage: (req, res): string => {
      const timeTaken = Date.now() - res[startTime]; // startTime assigned in execution-time middleware

      return `Request ${chalk.underline('completed')} in ${chalk.greenBright(
        `+${timeTaken}ms`
      )}`;
    },
    customErrorMessage: (req, res): string => {
      const timeTaken = new Date().getTime() - res[startTime];

      return `Request ${chalk.underline('failed')} in ${chalk.greenBright(
        `+${timeTaken}ms`
      )}`;
    },
    genReqId: (): string => `${process.pid}-${generateUniqueId()}`
  }
});
