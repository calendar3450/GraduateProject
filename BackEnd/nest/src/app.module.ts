import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { Diagnosis, Pet } from './diagnosis/entities/diagnosis.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: process.env.TEST_DB_PASSWORD,
      database: 'test1',
      entities: [User, Pet, Diagnosis],
      synchronize: false,
      // type: 'mysql',
      // host: process.env.DB_HOST,
      // port: 3306,
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
      // entities: [User, , Pet, Diagnosis],
      // synchronize: false,
    }),
    AuthModule,
    EventsModule,
    DiagnosisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
