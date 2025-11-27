
import { Logger, Controller, Get, Post, Body, Param, Delete, Query, Session, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt.auth.guard';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthService.name);
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<any> {
    const { user_id, user_name, email, password } = dto;
    this.logger.log("################### start");
    this.logger.log(user_id);
    this.logger.log(user_name);
    this.logger.log("##################### end");
    await this.authService.signup(user_id, user_name, email, password);

    return { message: '회원가입 성공' };
  }  
  

  @Post('login')
  async login(@Body() body: { user_id: string; password: string }) {
    return this.authService.login(body.user_id, body.password);
  }

  @Post('refresh')
  async refresh(@Body() body: { id: string; refreshToken: string }) {
    return this.authService.refresh(body.id, body.refreshToken);
  }


  @Post('logout')
  @UseGuards(JwtAuthGuard) // 로그아웃 요청에도 토큰이 필요
  logout(@Req() req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }  

}