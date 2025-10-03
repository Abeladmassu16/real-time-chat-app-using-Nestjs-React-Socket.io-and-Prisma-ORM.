import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Get(':username')
  byUsername(@Param('username') username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }
}
