import { Controller, Get, Res } from '@nestjs/common';
import { RoomService } from './room/room.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getContent(@Res() res: Response) {
    const response = await this.roomService.readContent();

    res.status(200).header('Content-Type', 'image/jpeg').send(response);
  }
}
