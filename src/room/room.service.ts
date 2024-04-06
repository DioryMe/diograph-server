import { LocalClient } from '@diograph/local-client';
import { S3Client } from '@diograph/s3-client';
import { constructAndLoadRoom } from '@diograph/utils';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigClient } from 'src/main';

const credentials = {
  region: 'eu-west-1',
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_KEY,
  },
};

const availableClients = {
  LocalClient: { clientConstructor: LocalClient },
  S3Client: { clientConstructor: S3Client, credentials },
};

@Injectable()
export class RoomService {
  constructor(@Inject('CONFIG_CLIENT') private configClient: ConfigClient) {}

  async readContent(cid: string) {
    // TODO: Enable providing ROOM_PATH as part of the url
    if (!process.env.ROOM_PATH) {
      throw new Error(`Can't use /content endpoint if ROOM_PATH not defined!`);
    }

    const address = process.env.ROOM_PATH;
    const roomClientType = 'LocalClient';

    const room = await constructAndLoadRoom(
      address,
      roomClientType,
      availableClients,
    );
    const response = await room.readContent(cid);

    return response;
  }

  async readContentFromS3(cid: string) {
    // TODO: Enable providing BUCKET_NAME as part of the url
    if (!process.env.BUCKET_NAME) {
      throw new Error(`Can't use /s3 endpoint if BUCKET_NAME not defined!`);
    }

    const bucketAddress = `s3://${process.env.BUCKET_NAME}`;
    const s3Address = `${bucketAddress}/room`;
    const address = s3Address;
    const roomClientType = 'S3Client';

    const room = await constructAndLoadRoom(
      address,
      roomClientType,
      availableClients,
    );

    const response = await room.readContent(cid);

    return response;
  }

  async getThumbnail(dioryId: string) {
    // TODO: Where the roomId comes from?
    // => somehow from the url?
    // => /thumbnail/:roomId/:dioryId
    const roomId = 'room-2';

    const { address, clientType } =
      await this.configClient.getRoomConfig(roomId);

    const room = await constructAndLoadRoom(
      address,
      clientType,
      availableClients,
    );

    const response = await room.diograph.getDiory({ id: dioryId });

    return response.image;
  }
}
