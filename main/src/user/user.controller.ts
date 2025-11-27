
import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInfo } from './user.model';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  async slctMyPage(@Param('id') userId: string): Promise<UserInfo> {
    return await this.userService.slctMyPage(userId);
  }

  @Put('user/:id')
    update(@Param('id') userId: string, @Body() userData: Partial<UserInfo>) {
    return this.userService.udtMyPage(userId, userData);
  }  
  
}