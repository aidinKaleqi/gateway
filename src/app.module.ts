import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [GatewayController],
  providers: [GatewayService, AuthGuard],
})
export class AppModule {}
