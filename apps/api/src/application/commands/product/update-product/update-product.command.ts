import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IProductRepository,
  IPRODUCT_REPOSITORY_TOKEN,
} from '@/domain/repositories/product.repository.interface';
import { UpdateProductDto } from '@/application/dtos/product/create-product.dto';
import { ProductResponseDto, ProductTypeEnum, UnitTypeEnum } from '@/application/dtos/product/create-product.dto';

@Injectable()
export class UpdateProductCommand {
  constructor(
    @Inject(IPRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    const product = await this.productRepository.update(id, {
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      type: dto.type,
      unit: dto.unit,
      price: dto.price?.toString(),
      cost: dto.cost?.toString(),
      taxRate: dto.taxRate?.toString(),
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
