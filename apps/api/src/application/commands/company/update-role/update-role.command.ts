import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';
import { UpdateRoleDto } from '@/application/dtos/company/invitation.dto';

const ALLOWED_ROLES = ['ACCOUNTANT', 'EMPLOYEE'] as const;

@Injectable()
export class UpdateRoleCommand {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    companyId: string,
    targetUserId: string,
    dto: UpdateRoleDto,
    callerUserId: string,
  ): Promise<{ message: string }> {
    // 1. Validate the requested role
    if (!ALLOWED_ROLES.includes(dto.role as typeof ALLOWED_ROLES[number])) {
      throw new BadRequestException(
        `Role must be one of: ${ALLOWED_ROLES.join(', ')}. ` +
        'SUPER_ADMIN and COMPANY_ADMIN cannot be assigned through this endpoint.',
      );
    }

    // 2. Check the caller has COMPANY_ADMIN role in this company
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
        'Only a COMPANY_ADMIN can update user roles',
      );
    }

    // 3. Cannot change own role
    if (callerUserId === targetUserId) {
      throw new ForbiddenException('You cannot change your own role');
    }

    // 4. Find the target user's role entry
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

    // 5. Cannot demote a COMPANY_ADMIN (don't allow changing COMPANY_ADMIN to lower roles)
    if (targetRole.role === 'COMPANY_ADMIN') {
      throw new ForbiddenException(
        'Cannot change the role of a COMPANY_ADMIN',
      );
    }

    // 6. Update the role
    await this.prisma.userCompanyRole.update({
      where: { id: targetRole.id },
      data: { role: dto.role },
    });

    return {
      message: `User role updated to ${dto.role}`,
    };
  }
}
