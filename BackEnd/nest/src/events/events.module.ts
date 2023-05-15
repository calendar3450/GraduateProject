import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Chatting, RoomName } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Chatting, RoomName])],
  providers: [TypeOrmModule, EventsGateway],
})
export class EventsModule {}
