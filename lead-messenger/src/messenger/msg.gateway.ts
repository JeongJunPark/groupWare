import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, Logger } from '@nestjs/common';

@WebSocketGateway({
  // cors: { origin: 'http://172.19.1.21:4010', credentials: true },
  cors: { origin: 'http://localhost:4010', credentials: true },
  // path: '/ChatRoom',
  path: '/socket.io'
})

export class MsgGateway implements OnModuleInit {
  private readonly logger = new Logger(MsgGateway.name);
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    console.log('🟢 MsgGateway initialized');
  }

  handleConnection(socket: Socket) {
    console.log('🟢 Client connected:', socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log('🔴 Client disconnected:', socket.id);
  }

@SubscribeMessage('joinRoom')
joinRoom(@MessageBody() data: { nickname: string; room: string }, @ConnectedSocket() client: Socket) {
  const { nickname, room } = data;
  client.join(room);
  // 이미 client.to(room)로만 보내고, 클라이언트에도 emit을 한 번만 보내도록
  this.server.to(room).emit('message', { sender: 'system', message: `${nickname}님이 입장했습니다.` });
}
  @SubscribeMessage('sendMessage')
  sendMessage(
    @MessageBody() data: { room: string; sender: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, sender, message } = data;
    
    console.log("message: ", message);
    this.logger.log("message: ", message);
    // 보낸 사람에게는 이미 클라이언트에서 화면 갱신하므로 제외
    client.to(room).emit('message', { sender, message });
  }
}
