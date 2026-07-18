import { IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Password reset token',
  })
  @IsString()
  @IsUUID()
  token: string;

  @ApiProperty({
    example: 'NewPassword1',
    description: 'New password (minimum 8 characters)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
