import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';
import { RoomConfigData } from '@diograph/diograph/types';
import { validateRoomConfigData } from '@diograph/diograph/validator';
import { redisClientFactory } from './redisClientFactory';
import RedisStore from 'connect-redis';
import * as session from 'express-session';

interface ConfigClient {
  getRoomConfigs(): Promise<RoomConfigData[]>;
  getRoomConfig(roomId: string): Promise<RoomConfigData>;
}

async function bootstrap(configClient: ConfigClient) {
  const app = await NestFactory.create(AppModule.forRoot(configClient));

  app.enableCors({
    origin: ['http://localhost:3300', 'http://localhost:5173'],
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  // Initialise session-store with Redis
  const redisClient = redisClientFactory();
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'diograph-server-session:',
  });

  app.use(
    session({
      store: redisStore,
      resave: true, // Resave on every request so the session will be refreshed
      saveUninitialized: false, // Don't save session before successful login
      secret: 'cf1d48728bd23c', // TODO: Move to .env
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
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
