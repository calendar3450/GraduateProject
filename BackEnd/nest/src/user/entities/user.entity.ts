import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'User' })
export class User {
  @ApiProperty({
    example: '홍길동',
    description: 'User name',
  })
  @IsString()
  @IsNotEmpty({ message: '이름을 작성해주세요.' })
  @PrimaryColumn({ type: 'varchar', nullable: false })
  userName: string;

  @ApiProperty({
    example: 'qwer1234',
    description: '유저 ID',
  })
  @Column({ type: 'varchar', nullable: false, unique: true })
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'password1234',
    description: 'User password',
  })
  @Column()
  password: string;

  @ApiProperty({
    example: 'JWT token',
    description: 'ex) eyJhbGciOiJ...',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  refreshToken!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
