import { Module } from '@nestjs/common';
import { ClientController } from '@/presentation/controllers/client.controller';
import { CreateClientCommand } from '@/application/commands/client/create-client/create-client.command';
import { UpdateClientCommand } from '@/application/commands/client/update-client/update-client.command';
import { PrismaClientRepository } from '@/infrastructure/persistence/prisma/repositories/client.repository';
import { ICLIENT_REPOSITORY_TOKEN } from '@/domain/repositories/client.repository.interface';

@Module({
  controllers: [ClientController],
  providers: [
    CreateClientCommand,
    UpdateClientCommand,
    {
      provide: ICLIENT_REPOSITORY_TOKEN,
      useClass: PrismaClientRepository,
    },
  ],
  exports: [ICLIENT_REPOSITORY_TOKEN],
})
export class ClientModule {}
