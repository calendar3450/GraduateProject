import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
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
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Request } from 'express';
import { UserService } from '../service/user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from 'src/auth/jwt/refreshtoken.guard';

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
    return await this.authService.validate(userName, token);
  }

  @ApiOperation({ summary: 'DB 모든 정보 가져오기' })
  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'DB 특정 값 가져오기' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: '회원 유저명 수정 API' })
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
  @Post('userUpdate')
  userUpdate(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.userUpdate(updateUserDto);
  }

  @ApiOperation({ summary: 'DB 특정 값 삭제하기' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
