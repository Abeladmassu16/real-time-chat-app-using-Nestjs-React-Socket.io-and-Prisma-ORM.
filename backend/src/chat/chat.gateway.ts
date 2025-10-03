import {
  WebSocketGateway, WebSocketServer,
  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage, MessageBody, ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service.js';
import { CreateMessageDto } from './dto/create-message.dto.js';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) ?? ['*'],
    credentials: true
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private chat: ChatService) {}

  afterInit() {
    console.log('[ws] Chat gateway initialized');
  }

  handleConnection(client: Socket) {
    const username = (client.handshake.query.username as string) || 'guest-' + client.id.slice(0, 5);
    const room = (client.handshake.query.room as string) || 'general';
    client.data.username = username;
    client.data.room = room;
    client.join(room);
    client.emit('system', { message: `Welcome ${username}! Joined room: ${room}` });
    client.to(room).emit('system', { message: `${username} joined ${room}` });
  }

  handleDisconnect(client: Socket) {
    const username = client.data?.username || 'guest';
    const room = client.data?.room || 'general';
    client.to(room).emit('system', { message: `${username} left ${room}` });
  }

  @SubscribeMessage('chat:message')
  async onMessage(@MessageBody() body: CreateMessageDto, @ConnectedSocket() client: Socket) {
    const room = body.roomId || client.data?.room || 'general';
    const username = body.username || client.data?.username || 'guest';
    const msg = await this.chat.createMessage(body.content, username, room);
    this.server.to(room).emit('chat:message', {
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      username: msg.user.username,
      room: room
    });
    return { ok: true };
  }
}
