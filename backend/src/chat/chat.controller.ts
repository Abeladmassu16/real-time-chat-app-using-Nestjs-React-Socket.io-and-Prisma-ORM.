import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service.js';

@Controller('messages')
export class ChatController {
  constructor(private chat: ChatService) {}

  @Get()
  async list(@Query('room') room?: string, @Query('limit') limit?: string) {
    const n = limit ? Math.max(1, Math.min(200, parseInt(limit, 10))) : 50;
    return this.chat.recentMessages(room || 'general', n);
  }
}
