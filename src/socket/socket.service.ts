import {
	Injectable,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import type { DeleteMessageDto, EditMessageDto, SendMessageDto } from 'src/dto/socket.dto'
import { InvalidDataException } from './error-message.exception'

@Injectable()
export class SocketService {
	constructor(private readonly prisma: PrismaService) {}

	async createMessage(data: SendMessageDto) {
		const checkUser = await this.prisma.checkExistUser(data.senderId)
		const checkChat = await this.prisma.checkExistChat(data.chatId)

		if (!checkChat) {
			throw new InvalidDataException('chat found')
		}
		if (!checkUser) {
			throw new InvalidDataException('sender id invalid, user not found')
		}

		const message = await this.prisma.message
			.create({
				data: {
					content: data.content,
					chatId: data.chatId,
					senderId: data.senderId,
				},
			})
			.catch(e => {
				throw new InvalidDataException(e.message)
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
			throw new InvalidDataException('user can not get access for this chat')
		}

		return true
	}

	async editMessage(data: EditMessageDto) {
		const message = await this.prisma.message.findUnique({
			where: {
				id: data.messageId,
			},
		})

		if (!message) {
			throw new InvalidDataException('Message not found')
		}

		if (message.senderId !== data.senderId) {
			throw new InvalidDataException('You can only edit your own messages')
		}

		const updatedMessage = await this.prisma.message.update({
			where: { id: data.messageId },
			data: { content: data.newContent },
		})

		return updatedMessage
	}

	async deleteMessage(data: DeleteMessageDto) {
		const findMessage = await this.prisma.message.findUnique({
			where: {
				id: data.messageId
			}
		})

		if (!findMessage) {
			throw new InvalidDataException('Message not found')
		}

		if (findMessage.senderId !== data.senderId) {
			throw new InvalidDataException('You can only delete your own messages'	)
		}

		const deletedMessage = await this.prisma.message.delete({
			where: {
				id: data.messageId,
				chatId: data.chatId
			}
		})

		if (!deletedMessage) {
			throw new InvalidDataException('delete error')
		}

		return deletedMessage
	}
}
