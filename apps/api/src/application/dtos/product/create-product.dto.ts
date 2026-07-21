import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ProductTypeEnum {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
}

export enum UnitTypeEnum {
  PZA = 'PZA',
  KG = 'KG',
  LT = 'LT',
  SERVICIO = 'SERVICIO',
  M = 'M',
  M2 = 'M2',
  M3 = 'M3',
  CAJA = 'CAJA',
  PAR = 'PAR',
  JUEGO = 'JUEGO',
  HORA = 'HORA',
}

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop HP ProBook 450',
    description: 'Product name',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Laptop HP ProBook 450 G10, Intel i7, 16GB RAM, 512GB SSD',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'LAP-HP-450',
    description: 'Stock Keeping Unit (SKU) code',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiProperty({
    enum: ProductTypeEnum,
    example: 'PRODUCT',
    description: 'Product type — physical product or service',
  })
  @IsEnum(ProductTypeEnum)
  type: ProductTypeEnum;

  @ApiProperty({
    enum: UnitTypeEnum,
    example: 'PZA',
    description: 'Unit of measure',
  })
  @IsEnum(UnitTypeEnum)
  unit: UnitTypeEnum;

  @ApiProperty({
    example: 25999.99,
    description: 'Sale price (in company currency)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    example: 18000.0,
    description: 'Cost price (for margin calculation)',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  cost?: number;

  @ApiProperty({
    example: 16.0,
    description: 'Tax rate percentage (e.g., 16 for IVA 16%)',
    default: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  taxRate: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Laptop HP ProBook 450',
    description: 'Product name',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated description',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'LAP-HP-450',
    description: 'Stock Keeping Unit (SKU) code',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiPropertyOptional({
    enum: ProductTypeEnum,
    example: 'PRODUCT',
    description: 'Product type',
  })
  @IsOptional()
  @IsEnum(ProductTypeEnum)
  type?: ProductTypeEnum;

  @ApiPropertyOptional({
    enum: UnitTypeEnum,
    example: 'PZA',
    description: 'Unit of measure',
  })
  @IsOptional()
  @IsEnum(UnitTypeEnum)
  unit?: UnitTypeEnum;

  @ApiPropertyOptional({
    example: 29999.99,
    description: 'Sale price',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({
    example: 20000.0,
    description: 'Cost price',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  cost?: number;

  @ApiPropertyOptional({
    example: 16.0,
    description: 'Tax rate percentage',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  taxRate?: number;
}

export class ProductResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  companyId: string;

  @ApiProperty({ example: 'Laptop HP ProBook 450' })
  name: string;

  @ApiProperty({ example: 'Laptop HP ProBook 450 G10', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'LAP-HP-450', nullable: true })
  sku: string | null;

  @ApiProperty({ enum: ProductTypeEnum, example: 'PRODUCT' })
  type: ProductTypeEnum;

  @ApiProperty({ enum: UnitTypeEnum, example: 'PZA' })
  unit: UnitTypeEnum;

  @ApiProperty({ example: '25999.99' })
  price: string;

  @ApiProperty({ example: '18000.00', nullable: true })
  cost: string | null;

  @ApiProperty({ example: '16.00' })
  taxRate: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: '2026-07-17T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-17T12:00:00.000Z' })
  updatedAt: Date;
}

// ─── Query DTO for paginated listing ─────────────────────────────────────────

export class FindAllProductsQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ example: 20, description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ example: 'Laptop', description: 'Search by name or SKU' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  products: ProductResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
