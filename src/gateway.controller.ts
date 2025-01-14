import { Controller, All, Req, Res, Inject } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { routesConfig } from '../routes/routes.config';
import { AuthGuard } from '../guards/auth.guard';
import { LoggerService } from '../logger/logger.service';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  @All('*')
  async handleRequest(@Req() req, @Res() res) {
    this.logger.log(`Incoming request: ${req.method} ${req.url}`);

    const route = routesConfig.find((r) => req.url.startsWith(r.path));

    if (!route) {
      this.logger.warn(`Route not found: ${req.url}`);
      return res.status(404).send({ message: 'Route not found' });
    }
    if (route.guardEnabled) {
      const isAllowed = await new AuthGuard().canActivate({
        switchToHttp: () => ({
          getRequest: () => req,
        }),
      } as any);

      if (!isAllowed) {
        return res.status(403).send({ message: 'Unauthorized' });
      }
    }
    await this.gatewayService.proxyRequest(req, res, route.target);
  }
}
