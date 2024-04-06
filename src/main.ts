import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';

interface RoomConfig {
  address: string;
  clientType: 'LocalClient' | 'S3Client';
}

interface ConfigClient {
  getRoomConfig(roomId: string): Promise<RoomConfig>;
}

const configClient: ConfigClient = {
  getRoomConfig: async (roomId: string) => {
    const rooms = {
      'room-1': {
        address: '/tmp',
        clientType: 'LocalClient',
      },
      'room-2': {
        address: '/tmp/demo-content/room-1',
        clientType: 'LocalClient',
      },
      'room-3': {
        address: 'jvalanen-diory-test3/room',
        clientType: 'S3Client',
      },
    };
    return rooms[roomId];
  },
};

export async function bootstrap(configClient: ConfigClient) {
  const app = await NestFactory.create(AppModule.forRoot(configClient));

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}

bootstrap(configClient);

export { ConfigClient };
