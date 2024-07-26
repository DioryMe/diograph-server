import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RoomService } from './room/room.service';
import { ConfigClient } from './main';
import { ThrowawayController } from './throwaway/throwaway.controller';

@Module({
  controllers: [ThrowawayController]
})
export class AppModule {
  static forRoot(configClient: ConfigClient): DynamicModule {
    return {
      module: AppModule,
      imports: [],
      controllers: [AppController],
      providers: [
        RoomService,
        {
          provide: 'CONFIG_CLIENT',
          useValue: configClient,
        },
      ],
    };
  }
}
