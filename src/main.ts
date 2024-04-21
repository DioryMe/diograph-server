import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';
import { RoomConfigData } from '@diograph/diograph/types';
import { validateRoomConfigData } from '@diograph/diograph/validator';

interface ConfigClient {
  getRoomConfigs(): Promise<RoomConfigData[]>;
  getRoomConfig(roomId: string): Promise<RoomConfigData>;
}

async function bootstrap(configClient: ConfigClient) {
  const app = await NestFactory.create(AppModule.forRoot(configClient));

  app.enableCors({ origin: 'http://localhost:5173' });
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}

if (process.env.DIOGRAPH_SERVER_STARTUP) {
  const room1RoomConfig: RoomConfigData = {
    id: 'room-1',
    address: '/tmp/demo-content/room-1',
    clientType: 'LocalClient',
  };
  validateRoomConfigData(room1RoomConfig);

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

export { bootstrap, ConfigClient };
