import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class AuthLoginDto extends PickType(User, ['id', 'password'] as const) {}
