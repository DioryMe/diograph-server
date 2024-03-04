import { LocalClient } from '@diograph/local-client';
import { S3Client } from '@diograph/s3-client';
import { constructAndLoadRoom } from '@diograph/utils';
import { Injectable } from '@nestjs/common';

const credentials = {
  region: 'eu-west-1',
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
};

const availableClients = {
  LocalClient: { clientConstructor: LocalClient },
  S3Client: { clientConstructor: S3Client, credentials },
};

@Injectable()
export class RoomService {
  async readContent(cid: string) {
    const address = '/Users/Jouni/PhotoRoom/room';
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
    const address = '/tmp';
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
