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

  async readContent() {
    const address = '/Users/Jouni/PhotoRoom/room';

    // JPG
    const CID = 'bafkreig6w4bromttln6hqnw3f3kqfhm7pcfbbtsgezaxvh7a2ipqbelrxy';

    // PDF
    // const CID = 'bafkreiffnhnovdvo7o5bm4n2bvh3dax2wjlvlja3axhakakvvjfmoqxbhq';

    // const address = '/Users/Jouni/Code/diograph-cli/tmp/room';
    // const CID = 'bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu';

    const roomClientType = 'LocalClient';

    const room = await this.initiateRoom(roomClientType, address);
    await room.loadRoom({ LocalClient: LocalClient, S3Client: S3Client });
    const response = await room.readContent(CID);
    return response;
  }
}
