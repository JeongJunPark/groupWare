import * as jwt from 'jsonwebtoken';
import { Inject, Logger, Injectable, UnprocessableEntityException, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import authConfig from 'src/config/authConfig';
import { ConfigType } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

  private blacklistedTokens: string[] = []; // 서버 메모리 블랙리스트
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) { }

  async login(user_id: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { user_id } });
    this.logger.log('조회된 유저:', user);
    this.logger.log(user);
    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    this.logger.log("password: ", password);
    this.logger.log("user.password: ", user.password);
    

    const isPasswordValid = await bcrypt.compare(password, user.password);
    this.logger.log("isPasswordValid: ", isPasswordValid);
    if (!isPasswordValid) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    this.logger.log("1")
    const payload = {
      user_id: user.user_id,
      // user_name: user.user_name,
      user_name: Buffer.from(user.user_name, 'utf8').toString(),
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
   
    this.logger.log("2")
    const token = this.jwtService.sign(
      { sub: user.user_id },
        { secret: process.env.JWT_SECRET, expiresIn: '1d' }
    );

    this.logger.log("3")
    // Refresh Token을 DB에 저장
    await this.usersRepository.update(user.user_id, { token });

    this.logger.log("4")
    return { accessToken, token };
  }

  async refresh(userId: string, refreshToken: string) {

    const user = await this.usersRepository.findOne({ where: { user_id: userId } });
    this.logger.log('userId:', userId);
    this.logger.log('user:', user);
    this.logger.log(user.token)
    if (!user || user.token !== refreshToken) {
      throw new UnauthorizedException('Refresh Token이 유효하지 않습니다.');
    }

    try {
      this.logger.log(refreshToken===user.token)
      // this.jwtService.verify(refreshToken);
      this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });
    } catch (e) {
      throw new UnauthorizedException('만료된 Refresh Token입니다.');
    }

    const newAccessToken = this.jwtService.sign(
      { sub: user.user_id, email: user.email },
      { expiresIn: '15m' }
    );

    return { accessToken: newAccessToken, remaining: this.getTokenRemainingTime(newAccessToken)  };
  }

    async signup(user_id: string, user_name: string, email: string, plainPassword: string) {
    // 이메일 중복 체크
    const existing = await this.usersRepository.findOne({ where: { email } });
    this.logger.log("existing: ", existing);
    if (existing) throw new ConflictException('이미 존재하는 이메일입니다.');

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // User 엔티티 생성
    const user = new UserEntity();
    user.user_id = user_id;
    user.user_name = user_name;
    user.email = email;
    user.password = hashedPassword;

    // DB 저장
    await this.usersRepository.save(user);

    return { message: '회원가입 완료', user_Id: user.user_id };
  }

    // 로그아웃 (토큰 블랙리스트 추가)    
    logout(token: string) {
      if (!token) throw new UnauthorizedException('토큰이 없습니다.');
      // 이미 로그아웃된 토큰이면 중복 추가 방지
      if (!this.blacklistedTokens.includes(token)) {
        this.blacklistedTokens.push(token);
      }
      return { message: '로그아웃 되었습니다.' };
    }    


    // 블랙리스트 토큰 검증
    isBlacklisted(token: string): boolean {
      return this.blacklistedTokens.includes(token);
    }  
    
    getTokenRemainingTime(token: string): string {
      try {
        const decoded: any = this.jwtService.decode(token);
        if (!decoded?.exp) return '만료 정보 없음';

        let exp = decoded.exp;
        // 🔹 exp가 밀리초 단위면 초 단위로 변환
        if (exp > 9999999999) exp = Math.floor(exp / 1000);

        const now = Math.floor(Date.now() / 1000);
        const remainingSeconds = exp - now;

        if (remainingSeconds <= 0) return '토큰 만료됨';

        const minutes = Math.floor(remainingSeconds / 60);
        return `${remainingSeconds}초 (${minutes}분 남음)`;
      } catch (err) {
        return '토큰 해석 오류';
      }
    }


}