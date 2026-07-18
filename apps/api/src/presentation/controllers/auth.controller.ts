import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterCommand } from '@/application/commands/register/register.command';
import { LoginCommand } from '@/application/commands/login/login.command';
import { RefreshCommand } from '@/application/commands/refresh/refresh.command';
import { LogoutCommand } from '@/application/commands/logout/logout.command';
import {
  RegisterDto,
  UserResponseDto,
} from '@/application/dtos/auth/register.dto';
import { LoginDto, LoginResponseDto } from '@/application/dtos/auth/login.dto';
import { RefreshDto, LogoutDto } from '@/application/dtos/auth/refresh.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerCommand: RegisterCommand,
    private readonly loginCommand: LoginCommand,
    private readonly refreshCommand: RefreshCommand,
    private readonly logoutCommand: LogoutCommand,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async register(@Body() dto: RegisterDto): Promise<UserResponseDto> {
    return this.registerCommand.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return tokens' })
  @ApiOkResponse({
    description: 'User successfully authenticated',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.loginCommand.execute(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and issue new access token' })
  @ApiOkResponse({
    description: 'Tokens successfully rotated',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Refresh token not found or expired' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async refresh(@Body() dto: RefreshDto): Promise<LoginResponseDto> {
    return this.refreshCommand.execute(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Log out user by deleting all refresh tokens' })
  @ApiNoContentResponse({
    description: 'User successfully logged out',
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async logout(@Body() dto: LogoutDto): Promise<void> {
    return this.logoutCommand.execute(dto.userId);
  }
}
