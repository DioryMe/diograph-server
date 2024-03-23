import { LocalClient } from '@diograph/local-client';
import { S3Client } from '@diograph/s3-client';
import { constructAndLoadRoom } from '@diograph/utils';
import { Injectable } from '@nestjs/common';

const credentials = {
  region: 'eu-west-1',
  credentials: {
    accessKeyId: process.env.DCLI_S3_CLIENT_ACCESS_KEY_ID,
    secretAccessKey: process.env.DCLI_S3_CLIENT_SECRET_ACCESS_KEY,
  },
};

const availableClients = {
  LocalClient: { clientConstructor: LocalClient },
  S3Client: { clientConstructor: S3Client, credentials },
};

@Injectable()
export class RoomService {
  async readContent(cid: string) {
    const address = '/tmp/demo-content-room/456';
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
    const address = 's3://jvalanen-diory-test3/room';
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
    const address = '/tmp/demo-content-room/123';
    const roomClientType = 'LocalClient';

    const room = await constructAndLoadRoom(
      address,
      roomClientType,
      availableClients,
    );

    const response = await room.diograph.getDiory({ id: dioryId });

    return response.image;
  }
}
