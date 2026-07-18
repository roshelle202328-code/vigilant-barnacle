import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterCommand } from '@/application/commands/register/register.command';
import { LoginCommand } from '@/application/commands/login/login.command';
import {
  RegisterDto,
  UserResponseDto,
} from '@/application/dtos/auth/register.dto';
import { LoginDto, LoginResponseDto } from '@/application/dtos/auth/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerCommand: RegisterCommand,
    private readonly loginCommand: LoginCommand,
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
}
