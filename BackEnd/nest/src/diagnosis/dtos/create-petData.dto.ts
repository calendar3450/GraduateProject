import { PickType } from '@nestjs/swagger';
import { Pet } from '../entities/diagnosis.entity';

export class CreatePetDataDto extends PickType(Pet, [
  'age',
  'breed',
  'gender',
  'petName',
] as const) {}
