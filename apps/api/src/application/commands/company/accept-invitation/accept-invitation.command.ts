import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class AcceptInvitationCommand {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    token: string,
    userId: string,
  ): Promise<{ message: string; companyId: string }> {
    // 1. Find the invitation by token
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // 2. Check status
    if (invitation.status === 'ACCEPTED') {
      throw new BadRequestException('This invitation has already been accepted');
    }

    if (invitation.status === 'EXPIRED' || invitation.expiresAt < new Date()) {
      // Mark as EXPIRED if past the expiration
      if (invitation.status !== 'EXPIRED') {
        await this.prisma.invitation.update({
          where: { id: invitation.id },
          data: { status: 'EXPIRED' },
        });
      }
      throw new BadRequestException('This invitation has expired');
    }

    // 3. Check that the accepting user's email matches the invitation
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new BadRequestException(
        'This invitation was sent to a different email address',
      );
    }

    // 4. Check user doesn't already have a role in this company
    const existingRole = await this.prisma.userCompanyRole.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId: invitation.companyId,
        },
      },
    });

    if (existingRole) {
      // Mark invitation as accepted anyway to clean up
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      });
      throw new ConflictException(
        'You already have a role in this company',
      );
    }

    // 5. Create the user_company_roles entry
    await this.prisma.userCompanyRole.create({
      data: {
        id: randomUUID(),
        userId,
        companyId: invitation.companyId,
        role: invitation.role,
      },
    });

    // 6. Mark invitation as ACCEPTED
    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: 'ACCEPTED' },
    });

    return {
      message: `You have been added to the company`,
      companyId: invitation.companyId,
    };
  }
}
