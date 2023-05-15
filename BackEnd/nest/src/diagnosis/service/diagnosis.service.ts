import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnosis, Pet } from '../entities/diagnosis.entity';
import axios from 'axios';

@Injectable()
export class DiagnosisService {
  constructor(
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    @InjectRepository(Diagnosis)
    private diagnosisRepository: Repository<Diagnosis>,
  ) {}

  async savePetData(author: any, body: any) {
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

  async savedResult(_id: any, files: Express.Multer.File[]) {
    const { petId } = _id;

    await this.diagnosisRepository.save({ petId });

    const fileName = `petEye/${files[0].filename}`;

    const imgUrl = `http://localhost:3000/media/${fileName}`;

    const saved = await this.diagnosisRepository.update(
      {
        petId: petId,
      },
      { imgUrl },
    );

    const url = `http://127.0.0.1:8000/diagnosis/dog/`;

    if (saved.affected == 0) {
      throw new BadRequestException('해당하는 펫 아이디를 찾을 수 없습니다.');
    }
    const data = {
      img: imgUrl,
    };

    const res = axios
      .post(url, data)
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
        throw new BadRequestException(`${errorMessage}`);
      });

    return res;
  }

  async findDiagnosis(body: any) {
    const { author } = body;
    const findData = await this.petRepository.find({
      where: { author: { userName: author } },
      order: { createdAt: 'DESC' },
    });
    return findData;
  }

  async findPetIdResult(body: any) {
    const { petId } = body;
    const findDiagnosisResult = await this.diagnosisRepository.findOne({
      where: { petId },
      order: { createdAt: 'DESC' },
    });
    return findDiagnosisResult.diagnosis;
  }
}
