import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { routesConfig } from '../routes/routes.config';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class GatewayService {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}

  async proxyRequest(req: any, res: any, target: string): Promise<void> {
    try {
      const basePath =
        routesConfig.find((r) => req.url.startsWith(r.path))?.path || '';
      const config: AxiosRequestConfig = {
        method: req.method,
        maxBodyLength: Infinity,
        url: `${target}${req.url.replace(basePath, '')}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(req.body),
        timeout: 10000,
      };
      if (req.user) config.headers['user'] = req.user;

      this.logger.log(`Proxying request to: ${config.url}`);

      const response = await axios.request(config);
      this.logger.log(`Response proxied successfully: ${config.url}`);
      res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
      this.logger.error(
        `Error proxying request to: ${target}${req.url}`,
        error.stack,
      );
      res.status(error.status).json(error.response.data);
    }
  }
}
