import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ICompanyRepository,
  ICOMPANY_REPOSITORY_TOKEN,
} from '@/domain/repositories/company.repository.interface';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';
import { CreateCompanyDto } from '@/application/dtos/company/create-company.dto';
import { CompanyResponseDto } from '@/application/dtos/company/create-company.dto';

@Injectable()
export class CreateCompanyCommand {
  constructor(
    @Inject(ICOMPANY_REPOSITORY_TOKEN)
    private readonly companyRepository: ICompanyRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    dto: CreateCompanyDto,
    userId: string,
  ): Promise<CompanyResponseDto> {
    // Validate taxId uniqueness
    const existing = await this.companyRepository.findByTaxId(dto.taxId);
    if (existing) {
      throw new ConflictException(
        `A company with tax ID "${dto.taxId}" already exists`,
      );
    }

    // Create the company
    const company = await this.companyRepository.create({
      name: dto.name,
      taxId: dto.taxId,
      country: dto.country,
      address: dto.address,
      phone: dto.phone,
      email: dto.email,
    });

    // Auto-assign COMPANY_ADMIN role to the creator
    await this.prisma.userCompanyRole.create({
      data: {
        id: randomUUID(),
        userId,
        companyId: company.id,
        role: 'COMPANY_ADMIN',
      },
    });

    return {
      id: company.id,
      name: company.name,
      taxId: company.taxId,
      country: company.country,
      subscriptionTier: company.subscriptionTier,
      active: company.active,
      address: company.address,
      phone: company.phone,
      email: company.email,
      logoUrl: company.logoUrl,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
