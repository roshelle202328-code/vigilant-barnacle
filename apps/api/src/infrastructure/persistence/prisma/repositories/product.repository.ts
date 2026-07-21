import { Injectable } from '@nestjs/common';
import {
  IProductRepository,
  CreateProductInput,
  UpdateProductInput,
  FindAllProductsInput,
  PaginatedProducts,
} from '@/domain/repositories/product.repository.interface';
import { Product } from '@/domain/entities/product.entity';
import type { ProductType, UnitType } from '@/domain/entities/product.entity';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductInput): Promise<Product> {
    const prismaProduct = await this.prisma.product.create({
      data: {
        companyId: data.companyId,
        name: data.name,
        description: data.description,
        sku: data.sku,
        type: data.type,
        unit: data.unit,
        price: data.price,
        cost: data.cost,
        taxRate: data.taxRate,
      },
    });

    return this.toDomain(prismaProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const prismaProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!prismaProduct) {
      return null;
    }

    return this.toDomain(prismaProduct);
  }

  async findBySku(companyId: string, sku: string): Promise<Product | null> {
    const prismaProduct = await this.prisma.product.findFirst({
      where: {
        companyId,
        sku,
      },
    });

    if (!prismaProduct) {
      return null;
    }

    return this.toDomain(prismaProduct);
  }

  async findAll(input: FindAllProductsInput): Promise<PaginatedProducts> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      companyId: input.companyId,
    };

    if (input.search) {
      where.OR = [
        { name: { contains: input.search, mode: 'insensitive' } },
        { sku: { contains: input.search, mode: 'insensitive' } },
        { description: { contains: input.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => this.toDomain(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    const prismaProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.sku !== undefined && { sku: data.sku }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.unit !== undefined && { unit: data.unit }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.cost !== undefined && { cost: data.cost }),
        ...(data.taxRate !== undefined && { taxRate: data.taxRate }),
      },
    });

    return this.toDomain(prismaProduct);
  }

  async deactivate(id: string): Promise<Product> {
    const prismaProduct = await this.prisma.product.update({
      where: { id },
      data: { active: false },
    });

    return this.toDomain(prismaProduct);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private toDomain(prismaProduct: {
    id: string;
    companyId: string;
    name: string;
    description: string | null;
    sku: string | null;
    type: string;
    unit: string;
    price: unknown;   // Prisma Decimal
    cost: unknown;    // Prisma Decimal | null
    taxRate: unknown; // Prisma Decimal
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return new Product(
      prismaProduct.id,
      prismaProduct.companyId,
      prismaProduct.name,
      prismaProduct.description,
      prismaProduct.sku,
      prismaProduct.type as ProductType,
      prismaProduct.unit as UnitType,
      String(prismaProduct.price),
      prismaProduct.cost != null ? String(prismaProduct.cost) : null,
      String(prismaProduct.taxRate),
      prismaProduct.active,
      prismaProduct.createdAt,
      prismaProduct.updatedAt,
    );
  }
}
