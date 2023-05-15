import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { userId, userName, password } = createUserDto;

    const isEmailExists = await this.userRepository.findOne({
      where: { userId },
    });

    const isUserNameExists = await this.userRepository.findOne({
      where: { userName },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isEmailExists != null) {
      throw new UnauthorizedException('입력한 아이디가 존재합니다.');
    }

    if (isUserNameExists != null) {
      throw new UnauthorizedException('입력한 유저명이 존재합니다.');
    }

    await this.userRepository.save({
      userId,
      userName,
      password: hashedPassword,
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(userId: string) {
    const isUserIdExist = await this.userRepository.findOneBy({ userId });
    if (isUserIdExist == null) {
      throw new UnauthorizedException('id가 존재하지 않습니다');
    }
    return userId;
  }

  async userUpdate(updateUserDto: UpdateUserDto) {
    const { userId, userName } = updateUserDto;

    const isUserNameExists = await this.userRepository.findOne({
      where: { userName },
    });

    if (isUserNameExists != null) {
      throw new UnauthorizedException('입력한 유저명이 존재합니다.');
    }

    await this.userRepository.update({ userId: userId }, { userName });
  }

  remove(userId: string) {
    return this.userRepository.delete({ userId: userId });
  }

  async updateByToken(userId: string, token: string) {
    return this.userRepository.update(
      { userId: userId },
      { refreshToken: token },
    );
  }

  async findByUserName(userName) {
    const user = await this.userRepository.findOneBy({ userName });
    if (user == null)
      throw new BadRequestException('해당하는 유저 네임을 찾을 수 없습니다.');
    return user;
  }

  async findById(userId: string) {
    const user = await this.userRepository.findOneBy({ userId });
    if (user == null)
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    return user;
  }
}
