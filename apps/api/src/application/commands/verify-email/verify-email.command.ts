import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class VerifyEmailCommand {
  constructor(private readonly prisma: PrismaService) {}

  async execute(token: string): Promise<void> {
    // 1. Find email verification token in DB
    const verificationToken = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // 2. Check if expired
    if (verificationToken.expiresAt < new Date()) {
      // Clean up expired token
      await this.prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      throw new BadRequestException('Invalid or expired verification token');
    }

    // 3. Mark user's email as verified
    await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    });

    // 4. Delete the used token
    await this.prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });
  }
}
