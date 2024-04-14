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

export async function bootstrap(configClient: ConfigClient) {
  const app = await NestFactory.create(AppModule.forRoot(configClient));

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}

export { ConfigClient, RoomConfig };
