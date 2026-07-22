import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
  ValidateNested,
  MinLength,
  MaxLength,
  IsUUID,
  Min,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum QuoteStatusEnum {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CONVERTED = 'CONVERTED',
}

// ─── Create Quote Item DTO ─────────────────────────────────────────────────────

export class CreateQuoteItemDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Product ID',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    example: 'MacBook Pro 14" M3',
    description: 'Line item description (snapshot of product name at quote time)',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description: string;

  @ApiProperty({ example: 1, description: 'Quantity' })
  @IsNumber()
  @Min(0.0001)
  quantity: number;

  @ApiProperty({ example: 2499.99, description: 'Unit price' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ example: 16, description: 'Tax rate percentage', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @ApiPropertyOptional({ example: 0, description: 'Discount rate percentage', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountRate?: number;
}

// ─── Create Quote DTO ──────────────────────────────────────────────────────────

export class CreateQuoteDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Client ID',
  })
  @IsUUID()
  clientId: string;

  @ApiProperty({
    example: '2026-07-17',
    description: 'Quote issue date (ISO 8601 date)',
  })
  @IsDateString()
  issueDate: string;

  @ApiProperty({
    example: '2026-08-17',
    description: 'Quote expiration date (ISO 8601 date)',
  })
  @IsDateString()
  expirationDate: string;

  @ApiPropertyOptional({
    example: 'Validez de 30 días. Precios sujetos a cambio.',
    description: 'Internal notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: 'Pago a 30 días. No incluye IVA.',
    description: 'Terms and conditions',
  })
  @IsOptional()
  @IsString()
  terms?: string;

  @ApiProperty({
    type: [CreateQuoteItemDto],
    description: 'Line items for the quote',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items: CreateQuoteItemDto[];
}

// ─── Update Quote Status DTO ───────────────────────────────────────────────────

export class UpdateQuoteStatusDto {
  @ApiProperty({
    enum: QuoteStatusEnum,
    example: 'SENT',
    description: 'New quote status',
  })
  @IsEnum(QuoteStatusEnum)
  status: QuoteStatusEnum;
}

// ─── Quote Item Response DTO ───────────────────────────────────────────────────

export class QuoteItemResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  quoteId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  productId: string;

  @ApiProperty({ example: 'MacBook Pro 14" M3' })
  description: string;

  @ApiProperty({ example: '1.0000' })
  quantity: string;

  @ApiProperty({ example: '2499.99' })
  unitPrice: string;

  @ApiProperty({ example: '16.00' })
  taxRate: string;

  @ApiProperty({ example: '0.00' })
  discountRate: string;

  @ApiProperty({ example: '2899.99' })
  total: string;
}

// ─── Quote Response DTO ────────────────────────────────────────────────────────

export class QuoteResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  companyId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  clientId: string;

  @ApiProperty({ example: 1 })
  number: number;

  @ApiProperty({ enum: QuoteStatusEnum, example: 'DRAFT' })
  status: QuoteStatusEnum;

  @ApiProperty({ example: '2026-07-17' })
  issueDate: string;

  @ApiProperty({ example: '2026-08-17' })
  expirationDate: string;

  @ApiProperty({ example: '2499.99' })
  subtotal: string;

  @ApiProperty({ example: '399.99' })
  taxTotal: string;

  @ApiProperty({ example: '0.00' })
  discountTotal: string;

  @ApiProperty({ example: '2899.99' })
  total: string;

  @ApiProperty({ example: 'Validez de 30 días', nullable: true })
  notes: string | null;

  @ApiProperty({ example: 'Pago a 30 días', nullable: true })
  terms: string | null;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003' })
  createdById: string;

  @ApiProperty({ example: '2026-07-17T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-17T12:00:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ type: [QuoteItemResponseDto] })
  items?: QuoteItemResponseDto[];
}

// ─── Query DTO for paginated listing ───────────────────────────────────────────

export class FindAllQuotesQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ example: 20, description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    enum: QuoteStatusEnum,
    example: 'DRAFT',
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(QuoteStatusEnum)
  status?: QuoteStatusEnum;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Filter by client ID',
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Search by quote number',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginatedQuotesResponseDto {
  @ApiProperty({ type: [QuoteResponseDto] })
  quotes: QuoteResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
