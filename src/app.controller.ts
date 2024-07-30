import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { RoomService } from './room/room.service';
import { Response } from 'express';
import { Redis } from 'ioredis';

@Controller()
export class AppController {
  constructor(
    private readonly roomService: RoomService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  @Get('rooms')
  async listRooms(@Res() res: Response) {
    const response = await this.roomService.getRoomConfigs();
    res.status(200).send(response);
  }

  @Get('rooms/:roomId')
  async getRoom(@Res() res: Response, @Param('roomId') roomId: string) {
    const roomsData = await this.roomService.getRoom(roomId);
    res.status(200).send(roomsData.toObject());
  }

  @Get('rooms/:roomId/diograph')
  async getRoomDiograph(
    @Res() res: Response,
    @Param('roomId') roomId: string,
    @Session() session: Record<string, any>,
  ) {
    const roomConfig = await this.getRoomConfig(roomId, session);

    const roomsData = await this.roomService.getRoom(roomId, roomConfig);
    res.status(200).send(roomsData.diograph.diograph);
  }

  @Get(':roomId/thumbnail')
  async renderThumbnail(
    @Res() res: Response,
    @Param('roomId') roomId: string,
    @Query('dioryId') dioryId: string,
    @Session() session: Record<string, any>,
  ) {
    if (!dioryId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing "dioryId" query parameter');
    }

    const roomConfig = await this.getRoomConfig(roomId, session);

    const response = await this.roomService.getThumbnail(
      roomId,
      dioryId,
      roomConfig,
    );

    const html = `<img src="${response}">`;
    res.status(200).header('Content-Type', 'text/html').send(html);
  }

  @Get(':roomId/content')
  async getContent(
    @Res() res: Response,
    @Param('roomId') roomId: string,
    @Query('cid') cid: string,
    @Query('mime') mime: string,
    @Session() session: Record<string, any>,
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

    const roomConfig = await this.getRoomConfig(roomId, session);

    const response = await this.roomService.readContent(
      roomId,
      cid,
      roomConfig,
    );

    res.status(200).header('Content-Type', mime).send(Buffer.from(response));
  }

  getRoomConfig = async (roomId, session: any) => {
    const response = await this.redisClient.get(
      `${session.userId}-rooms-${roomId}`,
    );
    const roomConfig =
      response === 'native'
        ? this.getNativeConfig(roomId, session)
        : JSON.parse(response);

    return roomConfig;
  };

  getNativeConfig = (roomId: string, session: any) => {
    return {
      address: `s3://jvalanen-diory-test3/${session.userId}/${roomId}`,
      clientType: 'S3Client',
      credentials: JSON.parse(session.awsCredentials),
    };
  };
}
