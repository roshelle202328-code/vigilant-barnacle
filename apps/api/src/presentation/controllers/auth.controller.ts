import { Controller, Get, Post, Body, Req, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Request } from 'express';
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
import { VerifyEmailCommand } from '@/application/commands/verify-email/verify-email.command';
import { ForgotPasswordCommand } from '@/application/commands/forgot-password/forgot-password.command';
import { ResetPasswordCommand } from '@/application/commands/reset-password/reset-password.command';
import {
  RegisterDto,
  UserResponseDto,
} from '@/application/dtos/auth/register.dto';
import { LoginDto, LoginResponseDto } from '@/application/dtos/auth/login.dto';
import { RefreshDto, LogoutDto } from '@/application/dtos/auth/refresh.dto';
import { VerifyEmailDto } from '@/application/dtos/auth/verify-email.dto';
import { ForgotPasswordDto } from '@/application/dtos/auth/forgot-password.dto';
import { ResetPasswordDto } from '@/application/dtos/auth/reset-password.dto';
import { JwtAuthGuard } from '@/presentation/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerCommand: RegisterCommand,
    private readonly loginCommand: LoginCommand,
    private readonly refreshCommand: RefreshCommand,
    private readonly logoutCommand: LogoutCommand,
    private readonly verifyEmailCommand: VerifyEmailCommand,
    private readonly forgotPasswordCommand: ForgotPasswordCommand,
    private readonly resetPasswordCommand: ResetPasswordCommand,
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

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email address' })
  @ApiOkResponse({
    description: 'Email successfully verified',
    schema: {
      example: { message: 'Email verified' },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid or expired verification token' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<{ message: string }> {
    await this.verifyEmailCommand.execute(dto.token);
    return { message: 'Email verified' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset link' })
  @ApiOkResponse({
    description: 'Password reset email sent if the account exists',
    schema: {
      example: { message: 'If email exists, reset link sent' },
    },
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    await this.forgotPasswordCommand.execute(dto.email);
    return { message: 'If email exists, reset link sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using a reset token' })
  @ApiOkResponse({
    description: 'Password reset successful',
    schema: {
      example: { message: 'Password reset successful' },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid or expired reset token' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.resetPasswordCommand.execute(dto.token, dto.newPassword);
    return { message: 'Password reset successful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({
    description: 'Current user info extracted from JWT',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  getMe(@Req() req: Request) {
    return req.user;
  }
}
