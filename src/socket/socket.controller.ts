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

  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.server.emit('message', 'Welcome to the chat!');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  @UseGuards(AccessGuard)
  async handleMessage(@MessageBody() sendMessageDto: string, @ConnectedSocket() client: Socket) {
    
    const dataFromBody = JSON.parse(sendMessageDto);
    
    const message = this.socketService.createMessage(dataFromBody)

    client
			.to(`chat_${dataFromBody.chatId}`)
			.emit('newMessage', message);
  }
}