import { Get, Param } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets'
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';
import type { PrismaService } from 'src/prisma.service'

@WebSocketGateway({ cors: true })
export class SocketController {
  @WebSocketServer()
  server: Server;

  // constructor(private readonly prisma: PrismaService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() sendMessageDto: SendMessageSocket,
    @ConnectedSocket() client: Socket,
  ) {
    // const message = await this.prisma.message.create({
    //   data: {
    //     content: sendMessageDto.content,
    //     chatId: sendMessageDto.chatId,
    //     senderId: sendMessageDto.senderId,
    //   },
    // });

    // client
		// 	.to(`chat_${sendMessageDto.chatId}`)
		// 	.emit('newMessage', message);
    return 'ok'
  }

  // @Get('chats/:chatId/messages')
  // async getChatMessages(@Param('chatId') chatId: string) {
  //   return this.prisma.message.findMany({
  //     where: { chatId: parseInt(chatId, 10) },
  //     orderBy: { createdAt: 'asc' },
  //   });
  // }
}


interface SendMessageSocket {
	chatId: number,
	content: string,
	senderId: number
}