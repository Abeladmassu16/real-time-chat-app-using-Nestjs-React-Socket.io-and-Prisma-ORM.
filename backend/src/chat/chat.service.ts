import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RoomsService } from '../rooms/rooms.service.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private rooms: RoomsService,
    private users: UsersService
  ) {}

  async createMessage(content: string, username: string, roomName = 'general') {
    const [room, user] = await Promise.all([
      this.rooms.findOrCreateByName(roomName),
      this.users.findOrCreateByUsername(username),
    ]);
    // Ensure membership (optional basic linkage)
    await this.prisma.membership.upsert({
      where: { userId_roomId: { userId: user.id, roomId: room.id } },
      update: {},
      create: { userId: user.id, roomId: room.id },
    });
    const msg = await this.prisma.message.create({
      data: { content, userId: user.id, roomId: room.id },
      include: { user: true, room: true }
    });
    return msg;
  }

  async recentMessages(roomName = 'general', limit = 50) {
    const room = await this.rooms.findOrCreateByName(roomName);
    return this.prisma.message.findMany({
      where: { roomId: room.id },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
      take: limit
    });
  }
}
