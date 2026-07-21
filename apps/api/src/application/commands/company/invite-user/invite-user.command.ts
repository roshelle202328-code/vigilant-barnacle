import {
  Injectable,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';
import { InviteUserDto } from '@/application/dtos/company/invitation.dto';
import { InvitationResponseDto } from '@/application/dtos/company/invitation.dto';

const ALLOWED_ROLES = ['ACCOUNTANT', 'EMPLOYEE'] as const;
const INVITATION_EXPIRY_DAYS = 7;

@Injectable()
export class InviteUserCommand {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    dto: InviteUserDto,
    companyId: string,
    inviterUserId: string,
  ): Promise<InvitationResponseDto | { message: string }> {
    // 1. Validate the requested role
    if (!ALLOWED_ROLES.includes(dto.role as typeof ALLOWED_ROLES[number])) {
      throw new BadRequestException(
        `Role must be one of: ${ALLOWED_ROLES.join(', ')}`,
      );
    }

    // 2. Check the inviter has COMPANY_ADMIN role in this company
    const inviterRole = await this.prisma.userCompanyRole.findUnique({
      where: {
        userId_companyId: {
          userId: inviterUserId,
          companyId,
        },
      },
    });

    if (!inviterRole || inviterRole.role !== 'COMPANY_ADMIN') {
      throw new ForbiddenException(
        'Only a COMPANY_ADMIN can invite users to this company',
      );
    }

    // 3. Check if the invited user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      // Check if they already have a role in this company
      const existingRole = await this.prisma.userCompanyRole.findUnique({
        where: {
          userId_companyId: {
            userId: existingUser.id,
            companyId,
          },
        },
      });

      if (existingRole) {
        throw new ConflictException(
          `User ${dto.email} already has a role in this company`,
        );
      }

      // Add the role directly — no invitation needed
      await this.prisma.userCompanyRole.create({
        data: {
          id: randomUUID(),
          userId: existingUser.id,
          companyId,
          role: dto.role,
        },
      });

      return {
        message: `User ${dto.email} has been added to the company`,
      };
    }

    // 4. Check for an existing pending invitation for this email + company
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: {
        email: dto.email,
        companyId,
        status: 'PENDING',
      },
    });

    if (existingInvitation) {
      throw new ConflictException(
        `A pending invitation already exists for ${dto.email}`,
      );
    }

    // 5. Create a new invitation
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

    const invitation = await this.prisma.invitation.create({
      data: {
        id: randomUUID(),
        email: dto.email,
        companyId,
        role: dto.role,
        invitedById: inviterUserId,
        token,
        status: 'PENDING',
        expiresAt,
      },
    });

    return {
      id: invitation.id,
      email: invitation.email,
      companyId: invitation.companyId,
      role: invitation.role,
      token: invitation.token,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
    };
  }
}
