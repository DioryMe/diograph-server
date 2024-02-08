import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { RoomService } from './room/room.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly roomService: RoomService) {}

  @Get('thumbnail')
  async renderThumbnail(
    @Res() res: Response,
    @Query('dioryId') dioryId: string,
  ) {
    if (!dioryId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing "dioryId" query parameter');
    }

    const response = await this.roomService.getThumbnail(dioryId);

    const html = `<img src="${response}">`;
    res.status(200).header('Content-Type', 'text/html').send(html);
  }

  @Get('content')
  async getContent(
    @Res() res: Response,
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

    const response = await this.roomService.readContent(cid);

    res.status(200).header('Content-Type', mime).send(response);
  }

  @Get('s3')
  async getS3Content(
    @Res() res: Response,
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

    const response = await this.roomService.readContentFromS3(cid);

    res.status(200).header('Content-Type', mime).send(Buffer.from(response));
  }
}
