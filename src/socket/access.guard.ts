import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import type { Socket } from 'socket.io';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>()
    const data = context.switchToWs().getData()
    const { senderId, chatId } = data

    const token = this.getTokenFromSocket(client)

    if (!token) {
      throw new UnauthorizedException('AccessToken is missing')
    }

    let decodedToken: any
    try {
      decodedToken = this.jwtService.verify(token, {
				secret: 'secret'
			}); 
    } catch (err) {
      throw new UnauthorizedException('Invalid token')
    }
    const userId = decodedToken.id;

    if (userId !== senderId) {
      return false
    }

    const chatMember = await this.prisma.chatMember.findFirst({
      where: {
        userId: userId,
        chatId: chatId,
      },
    });

    if (!chatMember) {
      return false
    }

    return true;
  }

  private getTokenFromSocket(client: Socket): string | null {
    const cookies = client.handshake.headers.cookie

		console.log(client.handshake)

    if (cookies) {
      const parsedCookies = this.parseCookies(cookies);
      return parsedCookies['accessToken']
    }
    return null
  }

  private parseCookies(cookies: string): { [key: string]: string } {
    return cookies.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=')
      acc[key.trim()] = value
      return acc
    }, {})
  }
}