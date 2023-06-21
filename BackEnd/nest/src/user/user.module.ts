import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './controller/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './service/user.service';
import { ConfigModule } from '@nestjs/config';
import { Diagnosis, Pet } from 'src/diagnosis/entities/diagnosis.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Pet, Diagnosis]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
