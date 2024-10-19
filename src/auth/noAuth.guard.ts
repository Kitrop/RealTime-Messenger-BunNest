import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	ForbiddenException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { Request, Response } from 'express'

@Injectable()
export class NoAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest()
		const response: Response = context.switchToHttp().getResponse()

		const accessToken = request.cookies['accessToken']

		// Если accessToken отсутствует, разрешаем доступ
		if (!accessToken) {
			return true
		}

		// Проверяем валидность токена
		const data = await this.jwtService.verifyAsync(accessToken, 
			{ secret: this.configService.get('SECRET_KEY') })
      .catch(err => {
        console.log("1");
        response.clearCookie('accessToken')
        return true
      })

    if (typeof data !== 'string') {
      console.log(data);
      // Если токен валиден, запрещаем доступ
      throw new ForbiddenException('Access denied: You are already authenticated')
    } else {
      console.log("2");
      response.clearCookie('accessToken')
      return true
    }
	}
}
