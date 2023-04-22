import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
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
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
