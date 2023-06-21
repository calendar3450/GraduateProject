import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Pet' })
export class Pet {
  @ApiProperty({
    example: 'Pet Id',
    description: 'uuid',
  })
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  petId: string;

  @ApiProperty({
    example: '초코',
    description: '펫 이름',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  petName: string;

  @ApiProperty({
    example: '견종',
    description: '웰시코기',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  breed: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  eyePosition: string;

  @ApiProperty({
    example: 5,
    description: '반려견 나이',
  })
  @IsNumber()
  @Column({ type: 'int', nullable: false })
  age: number;

  @ApiProperty({
    example: '수컷',
    description: '반려견 성별',
  })
  @IsString()
  @IsNotEmpty({ message: '반려동물 성별을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  gender: string;

  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '홍길동',
  })
  @ManyToOne(() => User, (user) => user.userName)
  @JoinColumn({ name: 'author' })
  author: User;
}

@Entity({ name: 'Diagnosis' })
export class Diagnosis {
  @ApiProperty({
    example: '펫 아이디',
  })
  @PrimaryColumn()
  @ManyToOne(() => Pet, (pet) => pet.petId)
  @JoinColumn({ name: 'petId' })
  petId: Pet;

  @ApiProperty({
    example: '이미지 url',
  })
  @IsString()
  @Column({ nullable: true })
  imgUrl: string;

  @ApiProperty({
    example: '진단 결과',
  })
  @Column({ nullable: true })
  diagnosis: string;

  @ApiProperty({
    example: '진단 시간',
  })
  @CreateDateColumn()
  createdAt: Date;
}
