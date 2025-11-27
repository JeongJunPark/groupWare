import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];

    // 블랙리스트 체크
    if (this.authService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token is logged out');
    }

    try {
    //   const payload = this.jwtService.verify(token); // 토큰 검증
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'default_secret_key',
      });      
      request.user = payload; // request.user에 payload 저장
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
