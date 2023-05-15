import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { Chatting, RoomName } from './events/entities/chat.entity';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { Diagnosis, Pet } from './diagnosis/entities/diagnosis.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASSWORD,
      database: 'test1',
      entities: [User, Chatting, , Pet, Diagnosis, RoomName],
      synchronize: false,
    }),
    AuthModule,
    EventsModule,
    DiagnosisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
