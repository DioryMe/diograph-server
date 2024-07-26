import { DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { RoomService } from './room/room.service';
import { ConfigClient } from './main';
import { ThrowawayController } from './throwaway/throwaway.controller';
import { redisClientFactory } from './redisClientFactory';

export class AppModule {
  static forRoot(configClient: ConfigClient): DynamicModule {
    return {
      module: AppModule,
      imports: [],
      controllers: [AppController, ThrowawayController],
      providers: [
        RoomService,
        {
          provide: 'CONFIG_CLIENT',
          useValue: configClient,
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: redisClientFactory(),
        },
      ],
    };
  }
}
