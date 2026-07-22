import { Module } from '@nestjs/common';
import { QuoteController } from '@/presentation/controllers/quote.controller';
import { CreateQuoteCommand } from '@/application/commands/quote/create-quote/create-quote.command';
import { PrismaQuoteRepository } from '@/infrastructure/persistence/prisma/repositories/quote.repository';
import { PrismaClientRepository } from '@/infrastructure/persistence/prisma/repositories/client.repository';
import { PrismaProductRepository } from '@/infrastructure/persistence/prisma/repositories/product.repository';
import { IQUOTE_REPOSITORY_TOKEN } from '@/domain/repositories/quote.repository.interface';
import { ICLIENT_REPOSITORY_TOKEN } from '@/domain/repositories/client.repository.interface';
import { IPRODUCT_REPOSITORY_TOKEN } from '@/domain/repositories/product.repository.interface';

@Module({
  controllers: [QuoteController],
  providers: [
    CreateQuoteCommand,
    {
      provide: IQUOTE_REPOSITORY_TOKEN,
      useClass: PrismaQuoteRepository,
    },
    {
      provide: ICLIENT_REPOSITORY_TOKEN,
      useClass: PrismaClientRepository,
    },
    {
      provide: IPRODUCT_REPOSITORY_TOKEN,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [IQUOTE_REPOSITORY_TOKEN],
})
export class QuoteModule {}
