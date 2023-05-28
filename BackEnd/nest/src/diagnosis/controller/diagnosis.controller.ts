import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exceptions.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { DiagnosisService } from '../service/diagnosis.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePetDataDto } from '../dtos/create-petData.dto';
import { JwtAuthGuard } from 'src/auth/jwt/accesstoken.guard';
import { CurrentUser } from 'src/common/decorator/custom.decorator';
import { User } from 'src/user/entities/user.entity';
import { InputPetIdDto } from '../dtos/create-inputPetId.dto';
import { InputUserNameDto } from '../dtos/create-inputUserName.dts';

@Controller('diagnosis')
@ApiTags('Diagnosis')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @ApiOperation({ summary: '진단할 반려동물의 정보 입력' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: 'petId 반환',
    schema: {
      example: {
        success: true,
        data: {
          petId: 'ca2409ab-38b1-4298-b2d7-4cf772000fe9',
        },
      },
    },
  })
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @Post('petData')
  petLog(@CurrentUser() user: User, @Body() body: CreatePetDataDto) {
    return this.diagnosisService.savePetData(user.userName, body);
  }

  @ApiOperation({ summary: '강아지 안구 이미지 업로드' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: '진단 결과 반환',
    schema: {
      example: {
        success: true,
        data: {
          result: '무증상',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post('diagnosisImg')
  async diagnosisImg(
    @Body() body: InputPetIdDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { key } = await this.diagnosisService.uploadFileToS3('petEye', file);
    const url = this.diagnosisService.getAwsS3FileUrl(key);
    return await this.diagnosisService.savedUrlAndDiagnosis(body, url);
  }

  @ApiOperation({ summary: '회원의 모든 진단 결과 이력 출력' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: '회원의 모든 진단결과 반환',
    schema: {
      example: {
        success: true,
        data: [
          {
            petId: '92ebf761-68...',
            petName: '초코',
            breed: '푸들',
            age: 10,
            gender: '수컷',
            createdAt: '2023-05-14T12:04:50.410Z',
            updatedAt: '2023-05-14T12:04:50.410Z',
          },
        ],
      },
    },
  })
  @Post('findAllPetData')
  findAllPetData(@Body() body: InputUserNameDto) {
    return this.diagnosisService.findByUserName(body);
  }

  @ApiOperation({ summary: 'petId를 통한 진단 결과 출력' })
  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 201,
    description: '진단결과 반환',
    schema: {
      example: {
        success: true,
        data: {
          result: '무증상',
        },
      },
    },
  })
  @Post('findDiagnosisByPetId')
  findPetIdResult(@Body() body: InputPetIdDto) {
    return this.diagnosisService.findPetIdResult(body);
  }
}
