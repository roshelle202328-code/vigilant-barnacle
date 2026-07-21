import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserRole } from '@prisma/client';

// ─── Invite User ───────────────────────────────────────────────────────────────

export class InviteUserDto {
  @ApiProperty({
    example: 'contador@example.com',
    description: 'Email address of the user to invite',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'ACCOUNTANT',
    enum: ['ACCOUNTANT', 'EMPLOYEE'],
    description: 'Role to assign (cannot be SUPER_ADMIN or COMPANY_ADMIN)',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}

// ─── Update Role ───────────────────────────────────────────────────────────────

export class UpdateRoleDto {
  @ApiProperty({
    example: 'ACCOUNTANT',
    enum: ['ACCOUNTANT', 'EMPLOYEE'],
    description: 'New role for the user (cannot be SUPER_ADMIN or COMPANY_ADMIN)',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}

// ─── Response DTOs ─────────────────────────────────────────────────────────────

export class InvitationResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'contador@example.com' })
  email!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  companyId!: string;

  @ApiProperty({ example: 'ACCOUNTANT' })
  role!: string;

  @ApiProperty({ example: 'b3d4f5a6-c789-4d01-b234-567890abcdef' })
  token!: string;

  @ApiProperty({ example: 'PENDING' })
  status!: string;

  @ApiProperty({ example: '2026-07-24T12:00:00.000Z' })
  expiresAt!: Date;

  @ApiProperty({ example: '2026-07-17T12:00:00.000Z' })
  createdAt!: Date;
}

export class UserWithRoleDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId!: string;

  @ApiProperty({ example: 'juan@example.com' })
  email!: string;

  @ApiProperty({ example: 'Juan' })
  firstName!: string;

  @ApiProperty({ example: 'Pérez' })
  lastName!: string;

  @ApiProperty({ example: 'ACCOUNTANT' })
  role!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  roleId!: string;
}
