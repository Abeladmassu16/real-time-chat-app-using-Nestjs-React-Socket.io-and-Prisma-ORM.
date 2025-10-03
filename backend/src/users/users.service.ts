import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findOrCreateByUsername(username: string) {
    return this.prisma.user.upsert({
      where: { username },
      update: {},
      create: { username }
    });
  }
}
