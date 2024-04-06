import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RoomService } from './room/room.service';
import { ConfigClient } from './main';

@Module({})
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
