import { PickType } from '@nestjs/swagger';
import { Pet } from '../entities/diagnosis.entity';

export class InputUserNameDto extends PickType(Pet, ['author'] as const) {}
