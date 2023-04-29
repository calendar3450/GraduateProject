import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Chatting } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Chatting])],
  providers: [TypeOrmModule, EventsGateway],
})
export class EventsModule {}
