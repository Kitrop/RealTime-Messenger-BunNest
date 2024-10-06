import { Body, Controller, InternalServerErrorException, Post, Req } from '@nestjs/common';
import { ChatsService, type CreateChatDto } from './chats.service'
import type { Request } from 'express'

@Controller('chats')
export class ChatsController {
	constructor(private readonly chatService: ChatsService) {}

	@Post('chat')
	async createChat(@Body() body: CreateChatDto, @Req() req: Request) {
		const chat = await this.chatService.createChat(body)

		if (!chat) {
			throw new InternalServerErrorException('sorry :(')
		}

		return chat
	}
}
