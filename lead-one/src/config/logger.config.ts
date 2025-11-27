import * as winston from 'winston';
import * as path from 'path';

const DailyRotateFile = require('winston-daily-rotate-file');
const logDir = path.resolve(__dirname, '../../logs');
export const winstonLogger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      level: 'debug',
      dirname: 'logs',
      filename: 'leadone-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m',
      zippedArchive: true,
      // auditFile: null,
      auditFile: path.join(logDir, '.leadone-audit.json'), 
    }),
    new winston.transports.Console(),
  ],
});
