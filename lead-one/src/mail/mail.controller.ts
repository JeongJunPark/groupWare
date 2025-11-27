import { Logger, Controller, Post, Get, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  /**
   *  메일 발송 API
   */
  @Post('send')
  async sendMail(
    @Body() body: {
      from?: string;
      to: string;
      cc?: string;
      bcc?: string;
      subject: string;
      text?: string;
      html?: string;
    },
  ) {
    this.logger.debug('===== MailController SEND START =====');
    this.logger.debug(body);

    const result = await this.mailService.sendMail(body);

    this.logger.debug('===== MailController SEND END =====');
    return result;
  }

  /**
   *  메일 수신(POP3/IMAP) API
   */
  @Get('receive')
  async receiveMail() {
    this.logger.debug('===== MailController RECEIVE START =====');

    const result = await this.mailService.receiveMail();

    this.logger.debug('===== MailController RECEIVE END =====');
    return result;
  }
}