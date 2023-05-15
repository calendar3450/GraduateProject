import {
  Body,
  Controller,
  Post,
  UploadedFiles,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';
import { CreatePetDataDto } from '../dtos/create-petData.dto';
import { CreateDiagnosisImgDto } from '../dtos/create-diagnosisImg.dto';
import { JwtAuthGuard } from 'src/auth/jwt/accesstoken.guard';
import { CurrentUser } from 'src/common/decorator/custom.decorator';
import { User } from 'src/user/entities/user.entity';

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
  @UseInterceptors(FilesInterceptor('image', 1, multerOptions('petEye')))
  @Post('diagnosisImg')
  async diagnosisImg(
    @Body() body: CreateDiagnosisImgDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.diagnosisService.savedResult(body, files);
  }

  @ApiOperation({ summary: '회원의 모든 진단 결과 이력 출력' })
  @Post('findPetData')
  findPetData(@Body() body: any) {
    return this.diagnosisService.findDiagnosis(body);
  }

  @ApiOperation({ summary: 'petId를 통해 진단 결과 출력' })
  @Post('findDiagnosisByPetId')
  findPetIdResult(@Body() body: any) {
    return this.diagnosisService.findPetIdResult(body);
  }
}
