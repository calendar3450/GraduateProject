import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
  'id',
  'username',
  'password',
  'raisingPet',
] as const) {}
