import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { ParsedCookiesPayload } from './parsed-cookies-payload.interface';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookies = request.cookies as ParsedCookiesPayload;

    if (!cookies.Auth) {
      throw new UnauthorizedException(
        'Please log in in order to continue using this API'
      );
    }

    const { user } = await this.authService.findUserInfoByAccessToken(
      cookies.Auth
    );

    request.user = user;
    request.accessToken = cookies.Auth;

    return true;
  }
}
