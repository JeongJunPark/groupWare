import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailEntity } from './entity/mail.entity';
import * as Imap from 'imap-simple';
import * as fs from 'fs';
import * as path from 'path';

export interface SendMailOptions {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    path?: string;
    content?: Buffer | string;
  }[];
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(MailEntity)
    private readonly mailRepo: Repository<MailEntity>,
  ) {}

  /** 문자열 or 배열 → 무조건 배열 */
  private normalizeAddress(value?: string | string[]) {
    if (!value) return undefined;
    return Array.isArray(value)
      ? value
      : value.split(',').map(v => v.trim());
  }

  /** 메일 발송 */
  async sendMail(options: SendMailOptions) {
    this.logger.log(`메일 발송 시도 → ${options.to}`);

    try {
      const htmlContent = options.html ?? `<p>${options.text ?? ''}</p>`;

      await this.mailerService.sendMail({
        from: options.from || process.env.MAIL_FROM,
        to: this.normalizeAddress(options.to),
        cc: this.normalizeAddress(options.cc),
        bcc: this.normalizeAddress(options.bcc),
        subject: options.subject,
        text: options.text,
        html: htmlContent,
        attachments: options.attachments,
      });

      // DB 저장
      const mail = this.mailRepo.create({
        mail_title: options.subject,
        mail_contents: htmlContent,
        mail_sender: options.from || process.env.MAIL_FROM,
        mail_receiver: Array.isArray(options.to) ? options.to.join(',') : options.to,
        mail_ref: Array.isArray(options.cc) ? options.cc.join(',') : options.cc,
        mail_secret_ref: Array.isArray(options.bcc) ? options.bcc.join(',') : options.bcc,
        mail_attachment: options.attachments?.map(a => a.filename).join(','),
        mail_date: new Date(),
        mail_type: 'OUT',
        mail_favorite: 'N',
      });

      await this.mailRepo.save(mail);

      this.logger.log(`메일 전송 + 저장 완료 → ${options.to}`);
      return { message: '메일 전송 및 DB 저장 완료', to: options.to };
    } catch (error) {
      this.logger.error('===== MAIL ERROR START =====');
      this.logger.error(JSON.stringify(error, null, 2));
      this.logger.error('===== MAIL ERROR END =====');

      throw new Error(`메일 전송 실패: ${error.message}`);
    }
  }

  /** 디렉토리 생성 */
  private ensureAttachmentDir() {
    const dir = 'C:/images/mail_attachments';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  }

  /** MIME 인코딩 파일명 디코더 (강화 버전) */
  private decodeMimeWord(str: string): string {
    try {
      const match = str.match(/=\?([^?]+)\?([BQbq])\?([^?]+)\?=/);
      if (!match) return str;

      const encoding = match[2].toUpperCase();
      const encodedText = match[3];

      // Base64 (B)
      if (encoding === 'B') {
        const buf = Buffer.from(encodedText, 'base64');
        return buf.toString('utf8');
      }

      // Quoted-Printable (Q)
      if (encoding === 'Q') {
        const qp = encodedText
          .replace(/_/g, ' ')
          .replace(/=([A-Fa-f0-9]{2})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16)),
          );
        return qp;
      }
    } catch (e) {
      console.error('decodeMimeWord error:', e);
    }

    return str;
  }

  /** 안전한 파일명 생성 */
  private sanitizeFilename(name: string) {
    return name.replace(/[<>:"/\\|?*]/g, '_').trim();
  }

  /** 첨부파일 구조 재귀 탐색 */
  private extractAttachmentParts(struct: any[]): any[] {
    const result: any[] = [];
    for (const part of struct) {
      if (Array.isArray(part)) {
        result.push(...this.extractAttachmentParts(part));
      } else if (part.disposition?.type?.toUpperCase() === 'ATTACHMENT') {
        result.push(part);
      }
    }
    return result;
  }

  /** 메일 수신 */
  async receiveMail() {
    const config = {
      imap: {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASS,
        host: process.env.MAIL_HOST,
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false },
      },
    };

    try {
      this.logger.log('IMAP 접속 시도…');

      const connection = await Imap.connect(config);
      await connection.openBox('INBOX');

      const messages = await connection.search(['UNSEEN'], {
        bodies: ['HEADER', 'TEXT', ''],
        struct: true,
        markSeen: true,
      });

      if (messages.length === 0) {
        this.logger.log('새로운 수신 메일 없음');
        return { message: 'No new mail' };
      }

      this.logger.log(`${messages.length}개의 새 메일 발견`);
      const attachDir = this.ensureAttachmentDir();

      for (const msg of messages) {
        const header = msg.parts.find(p => p.which.includes('HEADER'));
        const body = msg.parts.find(p => p.which === 'TEXT');
        const rawBody = msg.parts.find(p => p.which === '')?.body ?? '';

        const from = header.body.from?.[0] ?? '';
        const to = header.body.to?.[0] ?? '';
        const subject = header.body.subject?.[0] ?? '';
        const date = new Date(header.body.date?.[0] ?? new Date());
        const content = body.body ?? '';
        const mail_size = msg.attributes.size ?? Buffer.byteLength(rawBody);

        // 첨부파일
        const attachments: string[] = [];
        const parts = this.extractAttachmentParts(msg.attributes.struct || []);

        for (const att of parts) {
          const data = await connection.getPartData(msg, att);

          const rawFilename = att.disposition.params.filename;
          let filename = this.decodeMimeWord(rawFilename);
          filename = this.sanitizeFilename(filename);

          const filePath = path.join(attachDir, filename);
          fs.writeFileSync(filePath, data);

          attachments.push(filename);
        }

        const mail = this.mailRepo.create({
          mail_title: subject,
          mail_contents: content,
          mail_sender: from,
          mail_receiver: to,
          mail_ref: null,
          mail_secret_ref: null,
          mail_attachment: attachments.join(','),
          mail_date: date,
          mail_type: 'IN',
          mail_favorite: 'N',
          mail_size: mail_size,
        });

        await this.mailRepo.save(mail);
      }

      this.logger.log('수신 메일 저장 완료');
      return { message: 'Received and saved mails', count: messages.length };
    } catch (error) {
      this.logger.error('IMAP 수신 오류', error.stack);
      throw new Error('메일 수신 실패: ' + error.message);
    }
  }
}
