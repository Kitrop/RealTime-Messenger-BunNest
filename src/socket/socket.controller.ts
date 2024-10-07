import { BadRequestException, Get, Param, Req, UseGuards } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets'
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard'
import { PrismaService } from 'src/prisma.service'
import { SocketService } from './socket.service'
import { AccessGuard } from './access.guard'
import type { Request } from 'express'
import { JwtService } from '@nestjs/jwt'

@WebSocketGateway({ cors: '*', credentials: true, })
export class SocketController {
  @WebSocketServer()
  server: Server;

  constructor(private readonly prisma: PrismaService, private readonly socketService: SocketService, private readonly jwtService: JwtService) {}

  @SubscribeMessage('sendMessage')
  @UseGuards(AuthGuard)
  @UseGuards(AccessGuard)
  async handleMessage(
    @MessageBody() sendMessageDto: SendMessageSocket,
    @ConnectedSocket() client: Socket,
  ) {
    const jwt = client.handshake.headers.cookie['accessToken']

    const message = this.socketService.createMessage(sendMessageDto)

    client
			.to(`chat_${sendMessageDto.chatId}`)
			.emit('newMessage', message);
  }

  @UseGuards(AuthGuard)
  @Get('chats/:chatId/messages')
  async getChatMessages(@Param('chatId') chatId: string, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    const dataJwt = this.jwtService.decode(accessToken)
    
    const isAccess = this.socketService.isAccess(+chatId, dataJwt.id)

    if (!isAccess) {
      throw new BadRequestException('not access to chat')
    }
      
    return this.prisma.message.findMany({
      where: { chatId: parseInt(chatId, 10) },
      orderBy: { createdAt: 'asc' },
    });
  }
}


export interface SendMessageSocket {
	chatId: number,
	content: string,
	senderId: number
}