import { ConsoleLogger } from '@nestjs/common';
import { Logger } from 'winston';
import { winstonLogger } from '../config/logger.config';

export class LeadMsgLogger extends ConsoleLogger {
  constructor(private readonly winston: Logger = winstonLogger) {
    super();
  }

  log(message: any, stack?: string, context?: string) {
    super.log(message, stack, context);            // 콘솔 출력
    this.winston.info(`[${context || 'App'}] ${message}${stack ? ' | ' + stack : ''}`); // 파일 출력
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.winston.error(`[${context || 'App'}] ${message}${trace ? ' | ' + trace : ''}`);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.winston.warn(`[${context || 'App'}] ${message}`);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    this.winston.debug(`[${context || 'App'}] ${message}`);
  }
}
