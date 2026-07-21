import { Injectable } from '@nestjs/common';
import {
  IClientRepository,
  CreateClientInput,
  UpdateClientInput,
  FindAllClientsInput,
  PaginatedClients,
} from '@/domain/repositories/client.repository.interface';
import { Client } from '@/domain/entities/client.entity';
import type { ClientType } from '@/domain/entities/client.entity';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClientInput): Promise<Client> {
    const prismaClient = await this.prisma.client.create({
      data: {
        companyId: data.companyId,
        type: data.type,
        firstName: data.firstName,
        lastName: data.lastName,
        businessName: data.businessName,
        taxId: data.taxId,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
      },
    });

    return this.toDomain(prismaClient);
  }

  async findById(id: string): Promise<Client | null> {
    const prismaClient = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!prismaClient) {
      return null;
    }

    return this.toDomain(prismaClient);
  }

  async findByTaxId(companyId: string, taxId: string): Promise<Client | null> {
    const prismaClient = await this.prisma.client.findFirst({
      where: {
        companyId,
        taxId,
      },
    });

    if (!prismaClient) {
      return null;
    }

    return this.toDomain(prismaClient);
  }

  async findAll(input: FindAllClientsInput): Promise<PaginatedClients> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      companyId: input.companyId,
    };

    if (input.search) {
      where.OR = [
        { firstName: { contains: input.search, mode: 'insensitive' } },
        { lastName: { contains: input.search, mode: 'insensitive' } },
        { businessName: { contains: input.search, mode: 'insensitive' } },
        { taxId: { contains: input.search, mode: 'insensitive' } },
        { email: { contains: input.search, mode: 'insensitive' } },
      ];
    }

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      clients: clients.map((c) => this.toDomain(c)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateClientInput): Promise<Client> {
    const prismaClient = await this.prisma.client.update({
      where: { id },
      data: {
        ...(data.type !== undefined && { type: data.type }),
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.businessName !== undefined && { businessName: data.businessName }),
        ...(data.taxId !== undefined && { taxId: data.taxId }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });

    return this.toDomain(prismaClient);
  }

  async deactivate(id: string): Promise<Client> {
    const prismaClient = await this.prisma.client.update({
      where: { id },
      data: { active: false },
    });

    return this.toDomain(prismaClient);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private toDomain(prismaClient: {
    id: string;
    companyId: string;
    type: string;
    firstName: string | null;
    lastName: string | null;
    businessName: string | null;
    taxId: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    notes: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Client {
    return new Client(
      prismaClient.id,
      prismaClient.companyId,
      prismaClient.type as ClientType,
      prismaClient.firstName,
      prismaClient.lastName,
      prismaClient.businessName,
      prismaClient.taxId,
      prismaClient.email,
      prismaClient.phone,
      prismaClient.address,
      prismaClient.notes,
      prismaClient.active,
      prismaClient.createdAt,
      prismaClient.updatedAt,
    );
  }
}
