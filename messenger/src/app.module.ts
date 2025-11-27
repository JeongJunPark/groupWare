import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MsgGateway } from './messenger/msg.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MsgGateway],
})
export class AppModule {}
