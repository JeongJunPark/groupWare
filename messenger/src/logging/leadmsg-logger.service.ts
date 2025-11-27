import { Logger } from 'winston';
import { ConsoleLogger } from '@nestjs/common';

export class LeadMsgLogger extends ConsoleLogger {
  constructor(private readonly winston: Logger) {
    super();
  }

  log(message: any, stack?: string, context?: string) {
    super.log(message, stack, context);       // 콘솔 출력
    this.winston.info(message);               // 파일 출력
  }
}
