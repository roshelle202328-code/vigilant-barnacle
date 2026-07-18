import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Refresh token to rotate',
  })
  @IsString()
  @IsUUID()
  refreshToken: string;
}

export class LogoutDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID to log out (will be replaced by JWT guard)',
  })
  @IsString()
  @IsUUID()
  userId: string;
}
