import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { routesConfig } from './routes.config';

@Injectable()
export class GatewayService {
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
      const response = await axios.request(config);
      res.status(response.status).set(response.headers).send(response.data);
    } catch (err) {
      console.error('Error in proxyRequest:', err);
      res.status(500).json({ message: 'Error while processing request' });
    }
  }
}
