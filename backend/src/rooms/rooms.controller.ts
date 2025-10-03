import { Controller, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service.js';

@Controller('rooms')
export class RoomsController {
  constructor(private rooms: RoomsService) {}

  @Get()
  list() {
    return this.rooms.list();
  }
}
