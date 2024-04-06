import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RoomService } from './room/room.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [RoomService],
})
export class AppModule {}
