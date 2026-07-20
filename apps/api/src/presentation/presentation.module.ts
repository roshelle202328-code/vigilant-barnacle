import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { HealthModule } from './modules/health.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [InfrastructureModule, HealthModule, AuthModule],
  exports: [HealthModule],
})
export class PresentationModule {}
