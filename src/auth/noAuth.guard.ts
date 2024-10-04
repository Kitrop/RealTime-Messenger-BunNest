import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class NoAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['accessToken'];

    if (accessToken) {
      throw new ForbiddenException('Access denied: You are already authenticated.');
    }

    return true;
  }
}
