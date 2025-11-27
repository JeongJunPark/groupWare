import { Module, Logger } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import authConfig from '../config/authConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailEntity } from './entity/mail.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/config/.dev.env',
      load: [authConfig],
      isGlobal: true,
    }),

    TypeOrmModule.forFeature([MailEntity]),    

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // CA 인증서 경로
        const caPath = config.get<string>('CA_PATH');
        let tlsOptions: any = {};

        if (fs.existsSync(caPath)) {
            tlsOptions.ca = [fs.readFileSync(caPath, 'utf-8')];
            // tlsOptions.rejectUnauthorized = true;
            tlsOptions.rejectUnauthorized = false;
          console.log(`[MailModule] Loaded CA file from ${caPath}`);
        } else {
          console.warn(`[MailModule] CA file not found at ${caPath}, TLS verification may fail`);
          // 개발 환경에서는 TLS 무시 가능
        //   if (process.env.NODE_ENV !== 'production') {
            tlsOptions.rejectUnauthorized = false;
        //   }
        }

        return {
          transport: {
            host: config.get<string>('MAIL_HOST'),
            port: Number(config.get<number>('MAIL_PORT')),
            secure: true, // 465 포트 사용시
            Logger: true,
            debug: true,
            auth: {
              user: config.get<string>('MAIL_USER'),
              pass: config.get<string>('MAIL_PASS'),
            },
            authMethod: 'PLAIN',
            tls: tlsOptions,       
            family: 4    
          },
          connectionTimeout: 30000,
          greetingTimeout: 30000,
          socketTimeout: 30000,          
          defaults: {
            from: `"No Reply" <${config.get<string>('MAIL_FROM')}>`,
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {
  
    private readonly logger = new Logger(MailService.name);
    constructor(config: ConfigService){
      this.logger.log("##### TEST #####")
      this.logger.log(config.get<string>('MAIL_HOST'))
    }

}
