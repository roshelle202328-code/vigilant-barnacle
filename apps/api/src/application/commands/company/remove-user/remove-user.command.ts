import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class RemoveUserCommand {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    companyId: string,
    targetUserId: string,
    callerUserId: string,
  ): Promise<{ message: string }> {
    // 1. Check the caller has COMPANY_ADMIN role in this company
    const callerRole = await this.prisma.userCompanyRole.findUnique({
      where: {
        userId_companyId: {
          userId: callerUserId,
          companyId,
        },
      },
    });

    if (!callerRole || callerRole.role !== 'COMPANY_ADMIN') {
      throw new ForbiddenException(
        'Only a COMPANY_ADMIN can remove users from the company',
      );
    }

    // 2. Cannot remove self
    if (callerUserId === targetUserId) {
      throw new ForbiddenException('You cannot remove yourself from the company');
    }

    // 3. Find the target user's role entry
    const targetRole = await this.prisma.userCompanyRole.findUnique({
      where: {
        userId_companyId: {
          userId: targetUserId,
          companyId,
        },
      },
    });

    if (!targetRole) {
      throw new NotFoundException('User does not belong to this company');
    }

    // 4. Cannot remove the last COMPANY_ADMIN
    if (targetRole.role === 'COMPANY_ADMIN') {
      const companyAdminCount = await this.prisma.userCompanyRole.count({
        where: {
          companyId,
          role: 'COMPANY_ADMIN',
        },
      });

      if (companyAdminCount <= 1) {
        throw new BadRequestException(
          'Cannot remove the last COMPANY_ADMIN from the company',
        );
      }
    }

    // 5. Delete the user-company role
    await this.prisma.userCompanyRole.delete({
      where: { id: targetRole.id },
    });

    return {
      message: 'User has been removed from the company',
    };
  }
}
