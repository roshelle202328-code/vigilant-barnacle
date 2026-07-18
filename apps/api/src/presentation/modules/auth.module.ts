import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '@/presentation/controllers/auth.controller';
import { RegisterCommand } from '@/application/commands/register/register.command';
import { LoginCommand } from '@/application/commands/login/login.command';
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
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterCommand,
    LoginCommand,
    {
      provide: IUSER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
