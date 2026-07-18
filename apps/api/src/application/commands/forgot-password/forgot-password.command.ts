import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class ForgotPasswordCommand {
  constructor(private readonly prisma: PrismaService) {}

  async execute(email: string): Promise<void> {
    // 1. Find user by email (don't leak existence)
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return silently — don't reveal whether the email exists
      return;
    }

    // 2. Generate a password reset token with 1-hour expiry
    const resetToken = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    // 3. Log the token to the console (email integration comes later)
    // eslint-disable-next-line no-console
    console.log(
      `[ForgotPassword] Reset token for ${email}: ${resetToken} (expires at ${expiresAt.toISOString()})`,
    );
  }
}
