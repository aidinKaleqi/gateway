import { Controller, All, Req, Res } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { routesConfig } from './routes.config';
import { AuthGuard } from './auth.guard';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @All('*')
  async handleRequest(@Req() req, @Res() res) {
    const route = routesConfig.find((r) => req.url.startsWith(r.path));

    if (!route) {
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
