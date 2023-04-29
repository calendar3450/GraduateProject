import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Pet } from 'src/events/entities/chat.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'USER' })
export class User {
  @ApiProperty({
    example: 'email@~~.com',
    description: 'User email',
  })
  @PrimaryColumn({ type: 'varchar', nullable: false })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'password1234',
    description: 'User password',
  })
  @Exclude()
  @Column()
  password: string;

  @ApiProperty({
    example: '홍길동',
    description: 'User name',
  })
  @IsString()
  @IsNotEmpty({ message: '이름을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  username: string;

  @ApiProperty({
    example: true,
    description: 'true or false',
  })
  @IsBoolean()
  @Column({ type: 'boolean' })
  raisingPet: boolean;

  @IsString()
  @Column({ type: 'varchar', nullable: true })
  refreshToken!: string;

  @OneToMany(() => Pet, (pet) => pet.user)
  pets: Pet[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
