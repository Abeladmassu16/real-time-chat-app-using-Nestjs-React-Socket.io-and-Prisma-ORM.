import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateByName(name: string) {
    return this.prisma.room.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  list() {
    return this.prisma.room.findMany({ orderBy: { createdAt: 'asc' } });
  }
}
