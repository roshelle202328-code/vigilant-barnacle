import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class ResetPasswordCommand {
  constructor(private readonly prisma: PrismaService) {}

  async execute(token: string, newPassword: string): Promise<void> {
    // 1. Find the password reset token
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // 2. Check if expired
    if (resetToken.expiresAt < new Date()) {
      // Clean up expired token
      await this.prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      throw new BadRequestException('Invalid or expired reset token');
    }

    // 3. Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // 4. Update the user's password hash
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    // 5. Delete the used token
    await this.prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
  }
}
