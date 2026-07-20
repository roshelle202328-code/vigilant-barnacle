import { Injectable } from '@nestjs/common';
import {
  ICompanyRepository,
  CreateCompanyInput,
  UpdateCompanyInput,
} from '@/domain/repositories/company.repository.interface';
import { Company } from '@/domain/entities';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyInput): Promise<Company> {
    const prismaCompany = await this.prisma.company.create({
      data: {
        name: data.name,
        taxId: data.taxId,
        country: data.country,
        address: data.address,
        phone: data.phone,
        email: data.email,
        logoUrl: data.logoUrl,
      },
    });

    return this.toDomain(prismaCompany);
  }

  async findById(id: string): Promise<Company | null> {
    const prismaCompany = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!prismaCompany) {
      return null;
    }

    return this.toDomain(prismaCompany);
  }

  async findByTaxId(taxId: string): Promise<Company | null> {
    const prismaCompany = await this.prisma.company.findUnique({
      where: { taxId },
    });

    if (!prismaCompany) {
      return null;
    }

    return this.toDomain(prismaCompany);
  }

  async findAllForUser(userId: string): Promise<Company[]> {
    const userRoles = await this.prisma.userCompanyRole.findMany({
      where: { userId },
      include: { company: true },
    });

    return userRoles.map((role) => this.toDomain(role.company));
  }

  async update(id: string, data: UpdateCompanyInput): Promise<Company> {
    const prismaCompany = await this.prisma.company.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.taxId !== undefined && { taxId: data.taxId }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.active !== undefined && { active: data.active }),
      },
    });

    return this.toDomain(prismaCompany);
  }

  async deactivate(id: string): Promise<Company> {
    const prismaCompany = await this.prisma.company.update({
      where: { id },
      data: { active: false },
    });

    return this.toDomain(prismaCompany);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private toDomain(prismaCompany: {
    id: string;
    name: string;
    taxId: string;
    country: string;
    subscriptionTier: string;
    active: boolean;
    address: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Company {
    return new Company(
      prismaCompany.id,
      prismaCompany.name,
      prismaCompany.taxId,
      prismaCompany.country,
      prismaCompany.subscriptionTier,
      prismaCompany.active,
      prismaCompany.address,
      prismaCompany.phone,
      prismaCompany.email,
      prismaCompany.logoUrl,
      prismaCompany.createdAt,
      prismaCompany.updatedAt,
    );
  }
}
