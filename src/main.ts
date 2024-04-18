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

  app.enableCors({ origin: 'http://localhost:5173' });
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}

if (process.env.DIOGRAPH_SERVER_STARTUP) {
  const room1RoomConfig: RoomConfig = {
    id: 'room-1',
    address: '/tmp/demo-content/room-1',
    clientType: 'LocalClient',
  };
  const configClient: ConfigClient = {
    getRoomConfigs: async () => {
      return [room1RoomConfig];
    },
    getRoomConfig: async (roomId: string) => {
      const rooms = {
        [room1RoomConfig.id]: room1RoomConfig,
      };
      return rooms[roomId];
    },
  };

  bootstrap(configClient);
}

export { bootstrap, ConfigClient, RoomConfig };
