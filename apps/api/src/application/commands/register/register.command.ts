import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import {
  IUserRepository,
  IUSER_REPOSITORY_TOKEN,
} from '@/domain/repositories/user.repository.interface';
import { RegisterDto } from '@/application/dtos/auth/register.dto';
import { UserResponseDto } from '@/application/dtos/auth/register.dto';

@Injectable()
export class RegisterCommand {
  constructor(
    @Inject(IUSER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterDto): Promise<UserResponseDto> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.userRepository.createUser({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }
}
