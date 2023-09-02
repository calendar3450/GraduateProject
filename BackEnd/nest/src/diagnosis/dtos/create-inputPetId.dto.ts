import { PickType } from '@nestjs/swagger';
import { Diagnosis } from '../entities/diagnosis.entity';

export class InputPetIdDto extends PickType(Diagnosis, ['petId'] as const) {}
