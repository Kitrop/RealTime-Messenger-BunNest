import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service'
import type { SendMessageDto } from 'src/dto/socket.dto'

@Injectable()
export class SocketService {
	constructor(private readonly prisma: PrismaService) {}
	
	async createMessage(data: SendMessageDto) {
		const checkUser = this.prisma.checkExistUser(data.senderId)
		const checkChat = this.prisma.checkExistChat(data.chatId)
		
		if (!checkChat) {
			throw new NotFoundException('chat found')
		}
		if (!checkUser) {
			throw new BadRequestException('sender id invalid, user not found')
		}

		const message = await this.prisma.message.create({
      data: {
        content: data.content,
        chatId: data.chatId,
        senderId: data.senderId,
      },
    }).catch(e => {
			throw new InternalServerErrorException(e.message)
		})

		return message
	}

	async isAccess(chatId: number, userId: number) {
    const chatMember = await this.prisma.chatMember.findFirst({
      where: {
        userId: userId,
        chatId: chatId,
      },
    })

		if (!chatMember) {
			throw new BadRequestException('user can not get access for this chat')
		}

		return true
	}
}
