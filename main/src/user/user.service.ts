import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entity/user.entity';
import { UserInfo } from './user.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {

    constructor(
      @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private configService: ConfigService, 
    ){}

  async slctMyPage(userId: string): Promise<UserInfo> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });
    console.log(`userId: "${userId}"`);
    console.log("user: \n", user);
    if (!user) {
      throw new NotFoundException('getUserInfo 유저가 존재하지 않습니다');
    }

    return {
      user_id: user.user_id,
      user_name: user.user_name,
      email: user.email,
      password: user.password,
      token: user.token
    };
  }    

  async udtMyPage(userId: string, userData: Partial<UserInfo>) {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });
    console.log(`userId: "${userId}"`);
    console.log("user: \n", user);
    if (!user) {
      throw new NotFoundException('getUserInfo 유저가 존재하지 않습니다');
    }

    return this.usersRepository.update(userId, userData);

  }  
}