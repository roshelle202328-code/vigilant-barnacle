import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '@/presentation/controllers/auth.controller';
import { RegisterCommand } from '@/application/commands/register/register.command';
import { LoginCommand } from '@/application/commands/login/login.command';
import { RefreshCommand } from '@/application/commands/refresh/refresh.command';
import { LogoutCommand } from '@/application/commands/logout/logout.command';
import { VerifyEmailCommand } from '@/application/commands/verify-email/verify-email.command';
import { ForgotPasswordCommand } from '@/application/commands/forgot-password/forgot-password.command';
import { ResetPasswordCommand } from '@/application/commands/reset-password/reset-password.command';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories/user.repository';
import { IUSER_REPOSITORY_TOKEN } from '@/domain/repositories/user.repository.interface';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: 60 * 15, // 15 minutes
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterCommand,
    LoginCommand,
    RefreshCommand,
    LogoutCommand,
    VerifyEmailCommand,
    ForgotPasswordCommand,
    ResetPasswordCommand,
    {
      provide: IUSER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
