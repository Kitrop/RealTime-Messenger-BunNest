import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import type { Socket } from 'socket.io';
import { InvalidDataException } from './error-message.exception'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService, 
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>()
    const data = context.switchToWs().getData()
    
    let chatId: number
    let senderId: number

    try {
      const parseData = JSON.parse(data)
      chatId = parseData['chatId']
      senderId = parseData['senderId']
    } catch(err) {
      throw new InvalidDataException('invalid data body')
    }

    const token = this.getTokenFromSocket(client)
    
    if (!token) {
      throw new InvalidDataException('AccessToken is missing')
    }

    let decodedToken: any

    try {
      decodedToken = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get('SECRET_KEY')
			})
    } catch (err) {
      throw new InvalidDataException('Invalid accessToken');
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

    return true
  }

  private getTokenFromSocket(client: Socket): string | null {
    const token = client.handshake.auth.token

    if (token) {
      return token
    }
    
    return null
  }
}