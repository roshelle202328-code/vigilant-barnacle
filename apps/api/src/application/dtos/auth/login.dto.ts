import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './register.dto';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password1',
    description: 'User password',
  })
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs...',
    description: 'JWT access token (valid for 15 minutes)',
  })
  accessToken: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Refresh token for obtaining new access tokens',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Authenticated user profile',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
