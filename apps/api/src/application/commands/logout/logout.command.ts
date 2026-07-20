import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class LogoutCommand {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<void> {
    // Delete all refresh tokens for the user
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
