import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatController } from './chat.controller.js';
import { ChatGateway } from './chat.gateway.js';
import { RoomsModule } from '../rooms/rooms.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [RoomsModule, UsersModule],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
