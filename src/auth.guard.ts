import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('No or invalid token provided');
    }
    const token = authorization.split(' ')[1];
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/verify',
        {
          token,
        },
      );

      request.user = JSON.stringify(response.data.data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
