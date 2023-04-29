import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/service/user.service';
import { Payload } from './jwt.payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      //JWT가 에서 추출되는 방법을 제공합니다 Request.
      //API 요청의 Authorization 헤더에 베어러 토큰을 제공하는 표준 접근 방식을 사용
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //아래의 키는 절대 유출되어선 안됨!!
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
    });
  }
  //인증이 성공할 시에 전송되는 데이터 함수를 의미한다.
  async validate(payload: Payload) {
    const user = await this.userService.findById(payload.sub);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('접근오류');
    }
  }
}
