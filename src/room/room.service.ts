import { ConnectionClientList } from '@diograph/diograph/types';
import { LocalClient } from '@diograph/local-client';
// import { S3Client } from '@diograph/s3-client';
import { Inject, Injectable } from '@nestjs/common';

const availableClients: ConnectionClientList = {
  LocalClient: { clientConstructor: LocalClient },
  // S3Client: { clientConstructor: S3Client, credentials },
};

@Injectable()
export class RoomService {
  constructor(@Inject('CONFIG_CLIENT') private configClient: any) {}

  async readContent(cid: string) {
    const { address, contentClientType, contentUrls } =
      await this.configClient.getConnection();

    const client = new availableClients[contentClientType].clientConstructor(
      address,
    );

    const response = client.readItem(contentUrls[cid]);

    return response;
  }
}
