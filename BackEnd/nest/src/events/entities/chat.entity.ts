import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Chatting' })
export class Chatting {
  @ApiProperty({
    example: '홍길동',
    description: 'User name',
  })
  @IsString()
  @IsNotEmpty({ message: '이름을 작성해주세요.' })
  @PrimaryColumn({ type: 'varchar', nullable: false })
  username: string;

  @Column()
  socketId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity({ name: 'roomName' })
export class RoomName {
  @ApiProperty({})
  @PrimaryColumn()
  roomName: string;

  @Column({ type: 'boolean' })
  @IsBoolean()
  inAndOut: boolean;
}
