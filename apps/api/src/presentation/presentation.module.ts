import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { HealthModule } from './modules/health.module';

@Module({
  imports: [InfrastructureModule, HealthModule],
  exports: [HealthModule],
})
export class PresentationModule {}
