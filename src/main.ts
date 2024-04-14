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

bootstrap()

export { bootstrap, ConfigClient, RoomConfig };
