import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';
import { LoginResponseDto } from '@/application/dtos/auth/login.dto';
import { UserResponseDto } from '@/application/dtos/auth/register.dto';

@Injectable()
export class RefreshCommand {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(refreshToken: string): Promise<LoginResponseDto> {
    // 1. Find refresh token in DB
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // 2. Check if expired
    if (storedToken.expiresAt < new Date()) {
      // Delete expired token
      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    // 3. Delete the old refresh token (rotation)
    await this.prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // 4. Find user by userId
    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // 5. Issue new access token (JWT, 15min)
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // 6. Issue new refresh token and persist
    const newRefreshToken = randomUUID();
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    );

    await this.prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    // 7. Build user response
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
      refreshToken: newRefreshToken,
      user: userResponse,
    };
  }
}
