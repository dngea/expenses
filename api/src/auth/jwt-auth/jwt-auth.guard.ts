import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    // verification
    try {
      const payload = await this.jwtService.verifyAsync(token);

      request.user = { id: payload.sub };

      return true;
    } catch (error) {
      // does not match
      throw new UnauthorizedException('Invalid token');
    }
  }
}
