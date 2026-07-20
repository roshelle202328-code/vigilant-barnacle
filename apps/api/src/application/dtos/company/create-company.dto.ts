import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'Acme Corp',
    description: 'Company legal name',
  })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    example: 'RFC-123456-ABC',
    description: 'Company tax identification number',
  })
  @IsString()
  @Length(1, 50)
  taxId: string;

  @ApiProperty({
    example: 'MEX',
    description: 'ISO 3166-1 alpha-3 country code',
  })
  @IsString()
  @Length(3, 3)
  country: string;

  @ApiPropertyOptional({
    example: 'Av. Reforma 123, Ciudad de México',
    description: 'Company physical address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: '+52 55 1234 5678',
    description: 'Company contact phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'contacto@acmecorp.com',
    description: 'Company contact email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    example: 'Acme Corp S.A. de C.V.',
    description: 'Company legal name',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @ApiPropertyOptional({
    example: 'RFC-123456-ABC',
    description: 'Company tax identification number',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  taxId?: string;

  @ApiPropertyOptional({
    example: 'MEX',
    description: 'ISO 3166-1 alpha-3 country code',
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  country?: string;

  @ApiPropertyOptional({
    example: 'Av. Reforma 123, Ciudad de México',
    description: 'Company physical address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: '+52 55 1234 5678',
    description: 'Company contact phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'contacto@acmecorp.com',
    description: 'Company contact email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.factuflow.com/logos/acme.png',
    description: 'URL to company logo',
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}

export class CompanyResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Acme Corp' })
  name: string;

  @ApiProperty({ example: 'RFC-123456-ABC' })
  taxId: string;

  @ApiProperty({ example: 'MEX' })
  country: string;

  @ApiProperty({ example: 'STARTER' })
  subscriptionTier: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: 'Av. Reforma 123, Ciudad de México', nullable: true })
  address: string | null;

  @ApiProperty({ example: '+52 55 1234 5678', nullable: true })
  phone: string | null;

  @ApiProperty({ example: 'contacto@acmecorp.com', nullable: true })
  email: string | null;

  @ApiProperty({
    example: 'https://cdn.factuflow.com/logos/acme.png',
    nullable: true,
  })
  logoUrl: string | null;

  @ApiProperty({ example: '2026-07-17T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-17T12:00:00.000Z' })
  updatedAt: Date;
}
