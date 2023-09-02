import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthLoginDto } from 'src/auth/dto/auth.dto';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exceptions.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Request } from 'express';
import { UserService } from '../service/user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from 'src/auth/jwt/refreshtoken.guard';
import { JwtAuthGuard } from 'src/auth/jwt/accesstoken.guard';
import { CurrentUser } from 'src/common/decorator/custom.decorator';
import { User } from '../entities/user.entity';

@Controller('user')
@ApiTags('User')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: '유저 회원가입 API' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: '성공 여부',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @Post('signUp')
  async signUP(@Body() createUserDto: CreateUserDto) {
    return await this.userService.signUp(createUserDto);
  }

  @ApiOperation({ summary: '유저 로그인 API' })
  @ApiResponse({
    status: 500,
    description: 'server error...',
  })
  @ApiResponse({
    status: 201,
    description: '토큰',
    schema: {
      example: {
        success: true,
        data: { access_token: 'ey...', refresh_token: 'eyJ...' },
      },
    },
  })
  @Post('login')
  async login(@Body() body: AuthLoginDto) {
    return await this.authService.login(body);
  }

  @ApiOperation({
    summary: '로그인 유지 API',
    description: 'Bearer Token 헤더에 RefreshToken을 실어보낸다.',
  })
  @ApiBearerAuth('token')
  @ApiResponse({ status: 500, description: 'server error...' })
  @ApiResponse({
    status: 200,
    description: 'success: true, data: { 액세스 토큰 }',
    schema: {
      example: {
        access_token: 'wer23w31r2...',
      },
    },
  })
  @Get('getAccessToken')
  @UseGuards(JwtRefreshAuthGuard)
  async issueByRefreshToken(@Req() req: Request) {
    const token = req.user['refreshToken'];
    const userName = req.user['userName'];
    return await this.authService.validateByRefreshToken(userName, token);
  }

  @ApiOperation({ summary: '유저 회원 탈퇴' })
  @ApiBearerAuth('token')
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 200,
    description: 'success: true',
  })
  @Post('deleteUser')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: User, @Body() password: string) {
    return this.userService.remove(user.userId, password);
  }
}
