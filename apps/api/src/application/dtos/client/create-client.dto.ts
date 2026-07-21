import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ClientTypeEnum {
  PERSONA_FISICA = 'PERSONA_FISICA',
  PERSONA_MORAL = 'PERSONA_MORAL',
}

export class CreateClientDto {
  @ApiProperty({
    enum: ClientTypeEnum,
    example: 'PERSONA_FISICA',
    description: 'Client type — individual or legal entity',
  })
  @IsEnum(ClientTypeEnum)
  type: ClientTypeEnum;

  @ApiPropertyOptional({
    example: 'Juan',
    description: 'First name (required for PERSONA_FISICA)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Pérez',
    description: 'Last name (required for PERSONA_FISICA)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    example: 'Acme Corp S.A. de C.V.',
    description: 'Business name (required for PERSONA_MORAL)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  businessName?: string;

  @ApiProperty({
    example: 'XAXX010101000',
    description: 'Tax identification number (RFC/RUT/RUC)',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  taxId: string;

  @ApiPropertyOptional({
    example: 'juan@example.com',
    description: 'Client email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '+52 55 1234 5678',
    description: 'Client phone number',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Av. Reforma 123, Col. Centro, CDMX',
    description: 'Client physical address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'Cliente frecuente, pago a 30 días',
    description: 'Internal notes about this client',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateClientDto {
  @ApiPropertyOptional({
    enum: ClientTypeEnum,
    example: 'PERSONA_MORAL',
    description: 'Client type',
  })
  @IsOptional()
  @IsEnum(ClientTypeEnum)
  type?: ClientTypeEnum;

  @ApiPropertyOptional({
    example: 'Juan',
    description: 'First name',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Pérez',
    description: 'Last name',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    example: 'Acme Corp S.A. de C.V.',
    description: 'Business name',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  businessName?: string;

  @ApiPropertyOptional({
    example: 'XAXX010101000',
    description: 'Tax identification number',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  taxId?: string;

  @ApiPropertyOptional({
    example: 'juan@example.com',
    description: 'Client email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '+52 55 1234 5678',
    description: 'Client phone number',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Av. Reforma 123, Col. Centro, CDMX',
    description: 'Client physical address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'Cliente frecuente, pago a 30 días',
    description: 'Internal notes about this client',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ClientResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  companyId: string;

  @ApiProperty({ enum: ClientTypeEnum, example: 'PERSONA_FISICA' })
  type: ClientTypeEnum;

  @ApiProperty({ example: 'Juan', nullable: true })
  firstName: string | null;

  @ApiProperty({ example: 'Pérez', nullable: true })
  lastName: string | null;

  @ApiProperty({ example: 'Acme Corp S.A. de C.V.', nullable: true })
  businessName: string | null;

  @ApiProperty({ example: 'XAXX010101000' })
  taxId: string;

  @ApiProperty({ example: 'juan@example.com', nullable: true })
  email: string | null;

  @ApiProperty({ example: '+52 55 1234 5678', nullable: true })
  phone: string | null;

  @ApiProperty({ example: 'Av. Reforma 123, Col. Centro, CDMX', nullable: true })
  address: string | null;

  @ApiProperty({ example: 'Cliente frecuente', nullable: true })
  notes: string | null;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: '2026-07-17T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-17T12:00:00.000Z' })
  updatedAt: Date;
}

// ─── Query DTO for paginated listing ─────────────────────────────────────────

export class FindAllClientsQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ example: 20, description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ example: 'Juan', description: 'Search by name, taxId, or email' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginatedClientsResponseDto {
  @ApiProperty({ type: [ClientResponseDto] })
  clients: ClientResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
