import { Module } from '@nestjs/common';
import {
  CompanyController,
  InvitationController,
} from '@/presentation/controllers/company.controller';
import { CreateCompanyCommand } from '@/application/commands/company/create-company/create-company.command';
import { InviteUserCommand } from '@/application/commands/company/invite-user/invite-user.command';
import { AcceptInvitationCommand } from '@/application/commands/company/accept-invitation/accept-invitation.command';
import { UpdateRoleCommand } from '@/application/commands/company/update-role/update-role.command';
import { RemoveUserCommand } from '@/application/commands/company/remove-user/remove-user.command';
import { PrismaCompanyRepository } from '@/infrastructure/persistence/prisma/repositories/company.repository';
import { ICOMPANY_REPOSITORY_TOKEN } from '@/domain/repositories/company.repository.interface';

@Module({
  controllers: [CompanyController, InvitationController],
  providers: [
    CreateCompanyCommand,
    InviteUserCommand,
    AcceptInvitationCommand,
    UpdateRoleCommand,
    RemoveUserCommand,
    {
      provide: ICOMPANY_REPOSITORY_TOKEN,
      useClass: PrismaCompanyRepository,
    },
  ],
  exports: [ICOMPANY_REPOSITORY_TOKEN],
})
export class CompanyModule {}
