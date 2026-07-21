import { Module } from '@nestjs/common';
import { ProductController } from '@/presentation/controllers/product.controller';
import { CreateProductCommand } from '@/application/commands/product/create-product/create-product.command';
import { UpdateProductCommand } from '@/application/commands/product/update-product/update-product.command';
import { PrismaProductRepository } from '@/infrastructure/persistence/prisma/repositories/product.repository';
import { IPRODUCT_REPOSITORY_TOKEN } from '@/domain/repositories/product.repository.interface';

@Module({
  controllers: [ProductController],
  providers: [
    CreateProductCommand,
    UpdateProductCommand,
    {
      provide: IPRODUCT_REPOSITORY_TOKEN,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [IPRODUCT_REPOSITORY_TOKEN],
})
export class ProductModule {}
