import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthGuard } from '../guards/auth.guard';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [GatewayController],
  providers: [GatewayService, AuthGuard],
})
export class AppModule {}
