import { Module } from '@nestjs/common';
import { CompanyController } from '@/presentation/controllers/company.controller';
import { CreateCompanyCommand } from '@/application/commands/company/create-company/create-company.command';
import { PrismaCompanyRepository } from '@/infrastructure/persistence/prisma/repositories/company.repository';
import { ICOMPANY_REPOSITORY_TOKEN } from '@/domain/repositories/company.repository.interface';

@Module({
  controllers: [CompanyController],
  providers: [
    CreateCompanyCommand,
    {
      provide: ICOMPANY_REPOSITORY_TOKEN,
      useClass: PrismaCompanyRepository,
    },
  ],
  exports: [ICOMPANY_REPOSITORY_TOKEN],
})
export class CompanyModule {}
