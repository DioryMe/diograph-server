import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';

interface RoomConfig {
  address: string;
  roomClientType: 'LocalClient' | 'S3Client';
}

interface ConfigClient {
  getRooms(): Promise<RoomConfig[]>;
}

const configClient: ConfigClient = {
  getRooms: async () => {
    return [
      {
        address: '/tmp/demo-content/room-1',
        roomClientType: 'LocalClient',
      },
    ];
  },
};

export async function bootstrap(configClient: ConfigClient) {
  const app = await NestFactory.create(AppModule.forRoot(configClient));

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}

bootstrap(configClient);

export { ConfigClient };
