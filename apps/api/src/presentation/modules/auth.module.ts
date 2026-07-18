import { Module } from '@nestjs/common';
import { AuthController } from '@/presentation/controllers/auth.controller';
import { RegisterCommand } from '@/application/commands/register/register.command';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories/user.repository';
import { IUSER_REPOSITORY_TOKEN } from '@/domain/repositories/user.repository.interface';

@Module({
  controllers: [AuthController],
  providers: [
    RegisterCommand,
    {
      provide: IUSER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
