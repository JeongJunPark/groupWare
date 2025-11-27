import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import authConfig from './config/authConfig';
import { AuthModule } from './auth/auth.module';
import { BrdModule } from './brd/brd.module'
import { MailModule } from './mail/mail.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.DATABASE_HOST,
      port: 5432, 
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,      
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      migrations: [__dirname + '/**/migrations/*.ts'],
      migrationsTableName: 'migrations',
      logging: true, 
      logger: 'advanced-console',      


    }),    
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      // envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      // envFilePath: [path.resolve(__dirname, 'src/config/env/.dev.env')],
      envFilePath: 'src/config/.dev.env', 

      load: [authConfig],
      isGlobal: true,
    }),    
    BrdModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
