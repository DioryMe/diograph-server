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

  async readContent(roomId: string, cid: string) {
    const { address, clientType } =
      await this.configClient.getRoomConfig(roomId);

    const room = await constructAndLoadRoom(
      address,
      clientType,
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

  async getThumbnail(roomId: string, dioryId: string) {
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

  async getRoomConfigs() {
    return this.configClient.getRoomConfigs();
  }

  async getRoom(roomId: string) {
    const { address, clientType } =
      await this.configClient.getRoomConfig(roomId);

    const room = await constructAndLoadRoom(
      address,
      clientType,
      availableClients,
    );

    return room.toObject();
  }
}
