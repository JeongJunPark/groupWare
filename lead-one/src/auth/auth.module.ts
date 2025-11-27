import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import authConfig from '../config/authConfig';
import { AuthController } from './auth.controller'
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Logger } from '@nestjs/common';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forFeature(authConfig),
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: {
        expiresIn: '1d',
        audience: 'https://gw.leadds.co.kr/',
        issuer: 'gmail.com',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Logger],
  exports: [AuthService],
})
export class AuthModule {}