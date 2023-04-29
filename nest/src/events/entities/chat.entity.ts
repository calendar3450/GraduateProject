import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
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

@Entity({ name: 'Pet' })
export class Pet {
  @PrimaryGeneratedColumn()
  pet_id: number;

  @ApiProperty({
    example: '',
    description: 'Pet name',
  })
  @IsString()
  @IsNotEmpty({ message: '반려동물 이름을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: 5,
    description: 'Pet age',
  })
  @Column({ type: 'int', nullable: false })
  age: number;

  @ApiProperty({
    example: '수컷',
    description: 'Pet gender',
  })
  @IsString()
  @IsNotEmpty({ message: '반려동물 성별을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  gender: string;

  @ManyToOne(() => User, (user) => user.pets)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity({ name: 'Diagnosis' })
export class Diagnosis {
  @PrimaryGeneratedColumn()
  diagnosis_id: number;

  @Column()
  image: string;

  @Column()
  Result: string;

  @Column({ type: 'timestamp' })
  Time: Date;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;
}
