import { ConnectionClient, Room, RoomClient } from '@diograph/diograph';
import { LocalClient } from '@diograph/local-client';
import { S3Client } from '@diograph/s3-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  async getClientAndVerify(
    clientType: string,
    address: string,
  ): Promise<ConnectionClient> {
    console.log(`Verifying address for ${clientType}:`, address);
    let client: ConnectionClient;
    if (clientType == 'LocalClient') {
      client = new LocalClient(address);
      await client.verify();
    } else if ('S3Client') {
      client = new S3Client(address);
      await client.verify();
    } else {
      throw new Error(`getClientAndVerify: Unknown clientType: ${clientType}`);
    }

    return client;
  }

  async initiateRoom(
    contentClientType: string,
    address: string,
  ): Promise<Room> {
    const client = await this.getClientAndVerify(contentClientType, address);
    const roomClient = new RoomClient(client);
    const room = new Room(roomClient);
    return room;
  }

  async readContent(cid: string) {
    const address = '/Users/Jouni/PhotoRoom/room';
    const roomClientType = 'LocalClient';

    const room = await this.initiateRoom(roomClientType, address);
    await room.loadRoom({
      LocalClient: { clientConstructor: LocalClient },
      S3Client: { clientConstructor: S3Client },
    });
    const response = await room.readContent(cid);

    return response;
  }

  async readContentFromS3(cid: string) {
    const address = 's3://jvalanen-diory-test3/room';
    const roomClientType = 'S3Client';

    const room = await this.initiateRoom(roomClientType, address);

    await room.loadRoom({
      LocalClient: { clientConstructor: LocalClient },
      S3Client: { clientConstructor: S3Client },
    });

    const response = await room.readContent(cid);

    return response;
  }

  async getThumbnail(dioryId: string) {
    const address = '/tmp';
    const roomClientType = 'LocalClient';

    const room = await this.initiateRoom(roomClientType, address);

    await room.loadRoom({
      LocalClient: { clientConstructor: LocalClient },
      S3Client: { clientConstructor: S3Client },
    });

    const response = await room.diograph.getDiory({ id: dioryId });

    return response.image;
  }
}
