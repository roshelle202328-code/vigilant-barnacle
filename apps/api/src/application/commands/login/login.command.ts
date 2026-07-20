import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import {
  IUserRepository,
  IUSER_REPOSITORY_TOKEN,
} from '@/domain/repositories/user.repository.interface';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';
import { LoginDto, LoginResponseDto } from '@/application/dtos/auth/login.dto';
import { UserResponseDto } from '@/application/dtos/auth/register.dto';

@Injectable()
export class LoginCommand {
  constructor(
    @Inject(IUSER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    // 1. Find user by email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Generate access token (JWT, 15min)
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // 4. Generate refresh token and persist
    const refreshToken = randomUUID();
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    );

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    // 5. Build user response
    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };

    return {
      accessToken,
      refreshToken,
      user: userResponse,
    };
  }
}
