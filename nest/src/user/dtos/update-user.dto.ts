import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PickType(User, [
  'id',
  'password',
] as const) {}
