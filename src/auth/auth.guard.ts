import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt'
import type { Request, Response } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const accessToken = request.cookies['accessToken'];

    if (!accessToken) {
      throw new UnauthorizedException('Access denied: No access token provided.');
    }

    try {
      // Проверяем валидность токена
      await this.jwtService.verifyAsync(accessToken);
      return true; // Токен валидный, доступ разрешен
    } catch (error) {
      // Если токен невалидный, очищаем куки и выбрасываем исключение
      response.clearCookie('accessToken');
      throw new UnauthorizedException('Access denied: Invalid access token.');
    }
  }
}
