import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class ChatsService {
	constructor(private readonly prisma: PrismaService) {}

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
}


export interface CreateChatDto {
	name?: string
	members: number[]
}