import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(id: string, token: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new UnauthorizedException('id가 존재하지 않습니다');
    }

    if (token !== user.refreshToken) {
      throw new UnauthorizedException('리프레쉬 토큰이 일치하지 않습니다');
    }

    const payload = { sub: id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '30m',
      }),
    };
  }

  async login(data: AuthLoginDto) {
    const { id, password } = data;

    const user = await this.usersService.findById(id);

    if (user == null) {
      throw new Error('아이디가 존재하지 않습니다');
    }
    const checkPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!checkPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }

    const payload = { sub: user.id };

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_JWT_SECRET_KEY,
      expiresIn: '7d',
    });

    await this.usersService.updateByToken(user.id, refreshToken);

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '30m',
      }),
      refresh_token: refreshToken,
    };
  }
}
