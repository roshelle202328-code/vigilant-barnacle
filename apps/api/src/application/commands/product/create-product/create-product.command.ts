import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  IProductRepository,
  IPRODUCT_REPOSITORY_TOKEN,
} from '@/domain/repositories/product.repository.interface';
import { CreateProductDto } from '@/application/dtos/product/create-product.dto';
import { ProductResponseDto, ProductTypeEnum, UnitTypeEnum } from '@/application/dtos/product/create-product.dto';

@Injectable()
export class CreateProductCommand {
  constructor(
    @Inject(IPRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    dto: CreateProductDto,
    companyId: string,
  ): Promise<ProductResponseDto> {
    // Validate SKU uniqueness within the company (if SKU provided)
    if (dto.sku) {
      const existing = await this.productRepository.findBySku(companyId, dto.sku);
      if (existing) {
        throw new ConflictException(
          `A product with SKU "${dto.sku}" already exists in this company`,
        );
      }
    }

    const product = await this.productRepository.create({
      companyId,
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      type: dto.type,
      unit: dto.unit,
      price: dto.price.toString(),
      cost: dto.cost?.toString(),
      taxRate: dto.taxRate.toString(),
    });

    return this.toResponse(product);
  }

  private toResponse(product: {
    id: string;
    companyId: string;
    name: string;
    description: string | null;
    sku: string | null;
    type: string;
    unit: string;
    price: string;
    cost: string | null;
    taxRate: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ProductResponseDto {
    return {
      id: product.id,
      companyId: product.companyId,
      name: product.name,
      description: product.description,
      sku: product.sku,
      type: product.type as ProductTypeEnum,
      unit: product.unit as UnitTypeEnum,
      price: product.price,
      cost: product.cost,
      taxRate: product.taxRate,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
