import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { HealthModule } from './modules/health.module';
import { AuthModule } from './modules/auth.module';
import { CompanyModule } from './modules/company.module';
import { ClientModule } from './modules/client.module';
import { ProductModule } from './modules/product.module';
import { QuoteModule } from './modules/quote.module';

@Module({
  imports: [InfrastructureModule, HealthModule, AuthModule, CompanyModule, ClientModule, ProductModule, QuoteModule],
  exports: [HealthModule],
})
export class PresentationModule {}
