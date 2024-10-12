import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class ChatsService {
	constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

	async createChat(createChat: CreateChatDto) {
		const isGroup = createChat.members.length > 2;
		const chat = await this.prisma.chat.create({
			data: {
				name: isGroup ? createChat.name : null,
				isGroup,
				members: {
					create: createChat.members.map((memberId) => ({
						userId: memberId,
					})),
				},
			},
		});
		return chat;
	}

	async allMessages() {
		const data = await this.prisma.message.findMany()
		return data
	}

	async getMessages(getMessage: getMessagesDto) {
		const dataJwt = this.jwtService.decode(getMessage.accessToken)
		const isAccess = await this.isAccess(getMessage.chatId, dataJwt.id)

		if (!isAccess) {
      throw new BadRequestException('not access to chat')
    }

		const messages = await this.prisma.message.findMany({
      where: { chatId: getMessage.chatId },
      orderBy: { createdAt: 'asc' },
    })

		return messages
	}

	private async isAccess(chatId: number, userId: number) {
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

export interface getMessagesDto {
	accessToken: string,
	chatId: number,
}

export interface CreateChatDto {
	name?: string
	members: number[]
}