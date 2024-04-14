import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';

interface RoomConfig {
  id: string;
  address: string;
  clientType: string;
}

interface ConfigClient {
  getRoomConfigs(): Promise<RoomConfig[]>;
  getRoomConfig(roomId: string): Promise<RoomConfig>;
}

async function bootstrap(configClient: ConfigClient) {
  const app = await NestFactory.create(AppModule.forRoot(configClient));

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}

const configClient: ConfigClient = {
  getRoomConfigs: async () => {
    return [
      {
        id: 'room-1',
        address: '/tmp',
        clientType: 'LocalClient',
      },
    ];
  },
  getRoomConfig: async (roomId: string) => {
    const rooms = {
      'room-1': {
        id: 'room-1',
        address: '/tmp',
        clientType: 'LocalClient',
      },
    };
    return rooms[roomId];
  },
};

bootstrap(configClient);

export { bootstrap, ConfigClient, RoomConfig };
