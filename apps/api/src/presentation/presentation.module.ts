import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { HealthModule } from './modules/health.module';
import { AuthModule } from './modules/auth.module';
import { CompanyModule } from './modules/company.module';
import { ClientModule } from './modules/client.module';

@Module({
  imports: [InfrastructureModule, HealthModule, AuthModule, CompanyModule, ClientModule],
  exports: [HealthModule],
})
export class PresentationModule {}
