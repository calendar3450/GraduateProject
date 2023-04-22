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
    const { id, username, password, raisingPet } = createUserDto;

    const isEmailExists = await this.userRepository.findOne({ where: { id } });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isEmailExists != null) {
      throw new UnauthorizedException('입력한 아이디가 존재합니다.');
    }

    await this.userRepository.save({
      id,
      username,
      password: hashedPassword,
      raisingPet,
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const userId = await this.userRepository.findOneBy({ id });
    if (userId == null) {
      throw new UnauthorizedException('id가 존재하지 않습니다');
    }
    return userId;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete({ id: id });
  }

  async updateByToken(id: string, token: string) {
    return this.userRepository.update({ id: id }, { refreshToken: token });
  }

  async findById(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }
}
