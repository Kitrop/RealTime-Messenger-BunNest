import { UseGuards } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets'
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { SocketService } from './socket.service'
import { AccessGuard } from './access.guard'
import { parse } from 'path'
import { emit } from 'process'

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
    const dataFromBody = JSON.parse(sendMessageDto)
    
    const message = await this.socketService.createMessage(dataFromBody)

    client
			.to(`chat_${dataFromBody.chatId}`)
			.emit('newMessage', message);
  }

  @SubscribeMessage('editMessage')
  @UseGuards(AccessGuard)
  async handleEditMessage(@MessageBody() editMessageDto: string, @ConnectedSocket() client: Socket) {
    const dataFromBody = JSON.parse(editMessageDto);
    const updatedMessage = await this.socketService.editMessage(dataFromBody);
    
    client
      .to(`chat_${dataFromBody.chatId}`)
      .emit('messageUpdated', updatedMessage);
  }
}