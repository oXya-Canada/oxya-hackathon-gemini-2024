import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

// Define log format
const logFormat = winston.format.printf(({ level, message }) => `${level.toUpperCase()}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

const myCustomLevels: winston.config.AbstractConfigSetLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  notification: 4,
  debug: 5,
  silly: 6,
};

interface CustomLevels extends winston.Logger {
  error: winston.LeveledLogMethod;
  warn: winston.LeveledLogMethod;
  info: winston.LeveledLogMethod;
  http: winston.LeveledLogMethod;
  notification: winston.LeveledLogMethod;
  debug: winston.LeveledLogMethod;
  silly: winston.LeveledLogMethod;
}

const loggerInfo: CustomLevels = <CustomLevels>winston.createLogger({
  levels: myCustomLevels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  level: 'info',
  transports: [new LoggingWinston({ level: 'error', logName: 'error' })],
});

const loggerNotification = <CustomLevels>winston.createLogger({
  levels: myCustomLevels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  level: 'notification',
  transports: [new LoggingWinston({ levels: myCustomLevels, level: 'notification', logName: 'notification' })],
});

const logger = {
  error: params => {
    return loggerInfo.error(params);
  },
  warn: params => {
    return loggerInfo.warn(params);
  },
  info: (param1, param2?) => {
    return loggerInfo.info(param1, param2);
  },
  http: params => {
    return loggerInfo.http(params);
  },
  notification: params => {
    return loggerNotification.notification(params);
  },
  debug: params => {
    return loggerInfo.debug(params);
  },
  silly: params => {
    return loggerInfo.silly(params);
  },
};

loggerInfo.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.colorize(),
    ),
    level: 'http',
  }),
);

const stream = {
  write: (message: string) => {
    logger.http(message.substring(0, message.lastIndexOf('\n')));
  },
};

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  notification: 'cyan',
  debug: 'blue',
  silly: 'white',
});

export { logger, stream };
