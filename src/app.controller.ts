import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { RoomService } from './room/room.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly roomService: RoomService) {}

  @Get('rooms')
  async listRooms(@Res() res: Response) {
    const response = await this.roomService.getRoomConfigs();
    res.status(200).send(response);
  }

  @Get('rooms/:roomId')
  async getRoom(@Res() res: Response, @Param('roomId') roomId: string) {
    const roomsData = await this.roomService.getRoom(roomId);
    res.status(200).send(roomsData);
  }

  @Get('rooms/:roomId/diograph')
  async getRoomDiograph(@Res() res: Response, @Param('roomId') roomId: string) {
    const roomsData = await this.roomService.getRoom(roomId);
    res.status(200).send(roomsData.diograph);
  }

  @Get(':roomId/thumbnail')
  async renderThumbnail(
    @Res() res: Response,
    @Param('roomId') roomId: string,
    @Query('dioryId') dioryId: string,
  ) {
    if (!dioryId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing "dioryId" query parameter');
    }

    const response = await this.roomService.getThumbnail(roomId, dioryId);

    const html = `<img src="${response}">`;
    res.status(200).header('Content-Type', 'text/html').send(html);
  }

  @Get(':roomId/content')
  async getContent(
    @Res() res: Response,
    @Param('roomId') roomId: string,
    @Query('cid') cid: string,
    @Query('mime') mime: string,
  ) {
    if (!cid) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing "cid" query parameter');
    }
    if (!mime) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing "mime" query parameter');
    }

    const response = await this.roomService.readContent(roomId, cid);

    res.status(200).header('Content-Type', mime).send(Buffer.from(response));
  }
}
