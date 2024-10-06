import { type CanActivate, type ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import type { Request, Response } from 'express'

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const accessToken = request.cookies['accessToken'];

    // Если accessToken отсутствует, разрешаем доступ
    if (!accessToken) {
      return true; 
    }

    try {
      // Проверяем валидность токена
      await this.jwtService.verifyAsync(accessToken);
      // Если токен валиден, запрещаем доступ
      throw new ForbiddenException('Access denied: You are already authenticated.');
    } catch (error) {
      // Если токен невалидный, очищаем куки и разрешаем доступ
      response.clearCookie('accessToken');
      return true; 
    }
  }
}
