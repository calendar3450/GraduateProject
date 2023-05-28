import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnosis, Pet } from '../entities/diagnosis.entity';
import axios from 'axios';
import { InputPetIdDto } from '../dtos/create-inputPetId.dto';
import { CreatePetDataDto } from '../dtos/create-petData.dto';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class DiagnosisService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    @InjectRepository(Diagnosis)
    private diagnosisRepository: Repository<Diagnosis>,
  ) {
    this.awsS3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'), // process.env.AWS_S3_ACCESS_KEY
      secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      region: this.configService.get('AWS_S3_REGION'),
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME'); // nest-s3
  }

  async uploadFileToS3(
    folder: string,
    file: Express.Multer.File,
  ): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
  }> {
    try {
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');
      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();
      return { key, s3Object, contentType: file.mimetype };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  public getAwsS3FileUrl(objectKey: string) {
    return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
  }

  async savePetData(author: any, body: CreatePetDataDto) {
    const { petName, breed, age, gender } = body;

    const petData = await this.petRepository.save({
      petName,
      breed,
      age,
      gender,
      author,
    });
    return {
      petId: petData.petId,
    };
  }

  async savedUrlAndDiagnosis(_id: InputPetIdDto, url: string) {
    const { petId } = _id;
    await this.diagnosisRepository.save({ petId });
    const saved = await this.diagnosisRepository.update(
      {
        petId: petId,
      },
      { imgUrl: url },
    );

    if (saved.affected == 0) {
      throw new BadRequestException('해당하는 펫 아이디를 찾을 수 없습니다.');
    }

    const data = {
      img: url,
    };

    const djangoUrl = `${process.env.DJANGO_URI}`;

    const res = axios
      .post(djangoUrl, data)
      .then(async (response) => {
        await this.diagnosisRepository.update(
          {
            petId: petId,
          },
          { diagnosis: response.data.result },
        );
        return response.data;
      })
      .catch((error) => {
        const errorMessage = error.message;
        throw new BadRequestException(`---${errorMessage}`);
      });

    return res;
  }

  async findByUserName(body: any) {
    const { author } = body;
    const findData = await this.petRepository.find({
      where: { author: { userName: author } },
      order: { createdAt: 'DESC' },
    });
    return findData;
  }

  async findPetIdResult(body: InputPetIdDto) {
    const { petId } = body;
    const findDiagnosisResult = await this.diagnosisRepository.findOne({
      where: { petId },
      order: { createdAt: 'DESC' },
    });
    if (findDiagnosisResult && findDiagnosisResult.diagnosis) {
      return findDiagnosisResult.diagnosis;
    } else {
      return '진단 결과를 찾을 수 없습니다.';
    }
  }
}
