import { UseGuards } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets'
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { SocketService } from './socket.service'
import { AccessGuard } from './access.guard'
import { parse } from 'path'
import { emit } from 'process'
import { InvalidDataException } from './error-message.exception'
import { DeleteMessageDto, EditMessageDto, SendMessageDto } from 'src/dto/socket.dto'

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
    let dataFromBody: SendMessageDto
    try {
      dataFromBody = JSON.parse(sendMessageDto)
    } catch (err) {
      throw new InvalidDataException(err.message)
    }
  
    const message = await this.socketService.createMessage(dataFromBody)

    client
			.to(`chat_${dataFromBody.chatId}`)
			.emit('newMessage', message);
  }

  @SubscribeMessage('editMessage')
  @UseGuards(AccessGuard)
  async handleEditMessage(@MessageBody() editMessageDto: string, @ConnectedSocket() client: Socket) {
    let dataFromBody: EditMessageDto 
    
    try {
      dataFromBody = JSON.parse(editMessageDto)
    } catch (err) {
      throw new InvalidDataException('Invalid data body')
    }

    const updatedMessage = await this.socketService.editMessage(dataFromBody)

    client
      .to(`chat_${dataFromBody.chatId}`)
      .emit('messageUpdated', updatedMessage)
  }

  @SubscribeMessage('deleteMessage')
  @UseGuards(AccessGuard)
  async handleDeleteMessage(@MessageBody() deleteMessageDto: string, @ConnectedSocket() client: Socket) {
    let dataFromBody: DeleteMessageDto

    try {
      dataFromBody = JSON.parse(deleteMessageDto)
    } catch (err) {
      throw new InvalidDataException('Invalid data body')
    }

    const updatedMessage = await this.socketService.deleteMessage(dataFromBody)

    client
      .to(`chat_${dataFromBody.chatId}`)
      .emit('messageDelete', updatedMessage)
  }
}