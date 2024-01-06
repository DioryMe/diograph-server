import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { RoomService } from './room/room.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getContent(
    @Res() res: Response,
    @Query('cid') cid: string,
    @Query('mime') mime: string,
  ) {
    if (!cid) {
      return res.status(HttpStatus.BAD_REQUEST).send('Missing "cid" parameter');
    }
    if (!mime) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing "mime" parameter');
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
      return res.status(HttpStatus.BAD_REQUEST).send('Missing "cid" parameter');
    }
    if (!mime) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing "mime" parameter');
    }

    const response = await this.roomService.readContentFromS3(cid);

    res.status(200).header('Content-Type', mime).send(Buffer.from(response));
  }
}
